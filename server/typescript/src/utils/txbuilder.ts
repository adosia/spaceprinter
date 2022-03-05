import CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')

export const gruntTX = async ( utxoKey: any, utxos: string, assets:string, metadata: string, outputAddress: string, outputValue: string, changeAddress: string, txTTL: number ) => {
  let includeMeta = 0;
  try{
    // instantiate the tx builder with the Cardano protocol parameters - these may change later on
    const txBuilder = await CardanoWasm.TransactionBuilder.new(
        CardanoWasm.TransactionBuilderConfigBuilder.new()
        .fee_algo( CardanoWasm.LinearFee.new(CardanoWasm.BigNum.from_str('44'),CardanoWasm.BigNum.from_str('155381')))
        .pool_deposit(CardanoWasm.BigNum.from_str('500000000'),)
        .key_deposit( CardanoWasm.BigNum.from_str('2000000'),)
        .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482'))
        .max_value_size(5000)
        .max_tx_size(16384)
        .build()
    );
    // Output for ADA being send, Assets will use min required coin change will be calculated after all inputs are passed
    console.log( "adding Ada spent output");
    txBuilder.add_output(
      CardanoWasm.TransactionOutputBuilder.new()
      .with_address( CardanoWasm.Address.from_bech32(outputAddress) )
      .next()
      .with_value( CardanoWasm.Value.new( CardanoWasm.BigNum.from_str(outputValue)))
      .build()
    );

    // parse assets and add them to the TX
    if ( JSON.parse( assets ).length > 0 ){
      console.log( "Adding Assets" );
      const assetsToSend: any = await CardanoWasm.MultiAsset.new();
      const assetsToAdd = await CardanoWasm.Assets.new();

      JSON.parse( assets ).map(( asset: any ) => {
        // creating asset value for lovelaces
        const assetsValue = CardanoWasm.Value.new( CardanoWasm.BigNum.from_str('0') );
        
        // Inserting Native token
        assetsToAdd.insert(
          CardanoWasm.AssetName.new(Buffer.from(asset.assetName, "hex")),
          CardanoWasm.BigNum.from_str(asset.assetAmount)
        );
        
        // Adding asset to multiasset
        assetsToSend.insert(
          CardanoWasm.ScriptHash.from_bytes(Buffer.from(asset.policyID, "hex")),
          assetsToAdd
        );
        
        // Setting value with multiasset
        assetsValue.set_multiasset(assetsToSend);
        
        // output for asset transfer
        console.log( "adding asset output")
        txBuilder.add_output(
          CardanoWasm.TransactionOutputBuilder.new()
          .with_address( CardanoWasm.Address.from_bech32( outputAddress ))
          .next()
          .with_asset_and_min_required_coin( assetsToSend, CardanoWasm.BigNum.from_str('34482'))
          .build()
        );    
        // adding extra input for the asset with assetsValue set to 0.
        console.log("adding extra asset input: " + asset.txix)
        txBuilder.add_input(
          CardanoWasm.Address.from_bech32(changeAddress),
          CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(
                Buffer.from(asset.txix, "hex")
            ), // tx hash
            asset.txixIndex, // index
          ),
          assetsValue
        );
      });
    };
    
    // METADATA
    if( JSON.parse(metadata).length > 0 ){
      // MetaData stuff
      console.log('adding meta');
      const generalTxMeta = CardanoWasm.GeneralTransactionMetadata.new()
      const auxData = CardanoWasm.AuxiliaryData.new();

      JSON.parse(metadata).map(( meta: any) => 
        generalTxMeta.insert(
          CardanoWasm.BigNum.from_str( meta.label ),
          CardanoWasm.encode_json_str_to_metadatum(
            JSON.stringify(meta.metadata),
            0
          )
        )
      );
      await auxData.set_metadata(generalTxMeta);
      await txBuilder.set_auxiliary_data(auxData);
      includeMeta = 1;
    };

    // set all provided UTXOs as inputs and their values and indexes
    if ( JSON.parse(utxos).length > 0 ){
      console.log("adding inputs");
      JSON.parse(utxos).map(( utxo: any ) => {
        console.log( "adding input: " + utxo.txix )
        // set utxo input map the array 
        txBuilder.add_input(
          CardanoWasm.Address.from_bech32(changeAddress),
          CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(
                Buffer.from(utxo.txix, "hex")
            ), // tx hash
            utxo.txIndex, // index
          ),
          CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(utxo.inputValue))
        );
      });
    };

    // set the time to live - the absolute slot value before the tx becomes invalid
    console.log("setting ttl");
    await txBuilder.set_ttl(txTTL);

    // calculate the min fee required and send any change to an address
    console.log("setting change");
    await txBuilder.add_change_if_needed( CardanoWasm.Address.from_bech32(changeAddress) );

    // once the transaction is ready, we build it to get the tx body without witnesses
    console.log("Building and singing TX");
    const newTX = await txBuilder.build_tx();
    const txHash = await CardanoWasm.hash_transaction(newTX.body());

    // add keyhash witnesses
    const witnesses = await CardanoWasm.TransactionWitnessSet.new();
    const vkeyWitnesses = await CardanoWasm.Vkeywitnesses.new();
    const vkeyWitness = await await CardanoWasm.make_vkey_witness(txHash, utxoKey.to_raw_key());
    await vkeyWitnesses.add(vkeyWitness);
    await witnesses.set_vkeys(vkeyWitnesses);

    // create the finalized transaction with witnesses
    const transaction = await CardanoWasm.Transaction.new(
      newTX.body(),
      witnesses,
      includeMeta == 1 ? newTX.auxiliary_data() : undefined, //metadata
    );

    const txHex = await Buffer.from(transaction.to_bytes()).toString("hex");
    console.log(txHex);
    return(txHex);
  }catch(error){
    console.log( error );
    return( error );
  };
};
