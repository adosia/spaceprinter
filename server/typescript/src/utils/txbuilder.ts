import CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs');
// import CardanoWasm = require('@dcspark/cardano-multiplatform-lib-nodejs');

export const gruntTX = async ( utxoKey: any, utxos: string, assets:string, metadata: string, outputs: string, changeAddress: string, txTTL: number ) => {
  const witnesses = await CardanoWasm.TransactionWitnessSet.new();
  const vkeyWitnesses = await CardanoWasm.Vkeywitnesses.new();
  let includeMeta = 0;
  let datumData: any;
  let datumFields: any;

  try{
    // instantiate the tx builder with the Cardano protocol parameters - these may change later on
    const txBuilder: any = await CardanoWasm.TransactionBuilder.new(
      CardanoWasm.TransactionBuilderConfigBuilder.new()
        .fee_algo( CardanoWasm.LinearFee.new(CardanoWasm.BigNum.from_str('44'),CardanoWasm.BigNum.from_str('155381')))
        .pool_deposit(CardanoWasm.BigNum.from_str('500000000'),)
        .key_deposit( CardanoWasm.BigNum.from_str('2000000'),)
        .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482'))
        .max_value_size(5000)
        .max_tx_size(16384)
        .build()
    );
    
    // Set all provided UTXOs as inputs and their values and indexes
    if ( JSON.parse(utxos).length > 0 ){
      console.log("adding UTXOs");
      await JSON.parse(utxos).map( async( utxo: any ) => {
        // set utxo input map the array 
        console.log("Adding utxo: " + utxo.txix)
        await txBuilder.add_input(
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

    // parse UTXOs with assets and add them to the TX
    if ( JSON.parse( utxos ).length > 0 ){
      console.log( "Assets Inputs from UTXos" );
      await JSON.parse(utxos).map( async (utxo: any ) => {
        if( Object.entries( utxo.assets).length > 0 ) {
          console.log( "Adding Assets" );
          await Object.entries( utxo.assets).map( async ( asset: any )=>{
            // console.log(asset);
            const assetsVal = CardanoWasm.Value.new( CardanoWasm.BigNum.from_str('0') );
            const assetMA = CardanoWasm.MultiAsset.new();
            const assetToAdd = CardanoWasm.Assets.new();
           
            const policyID: string = asset[0].split(".")[0];
            const assetName: string = asset[0].split(".")[1];
            const amount = CardanoWasm.BigNum.from_str(asset[1].toString());

            // Inserting Native token
            console.log("Adding Asset: " + assetName )
            await assetToAdd.insert(
              CardanoWasm.AssetName.new(Buffer.from(assetName, "hex")),
              amount
            );

            // Adding asset to multiasset
            console.log("Adding Asset Policy: " + policyID )
            await assetMA.insert(
              CardanoWasm.ScriptHash.from_bytes(Buffer.from(policyID, "hex")),
              assetToAdd
            );

            // Setting value with multiasset
            await assetsVal.set_multiasset(assetMA);
            
            // adding input for the asset with assetsValue set to 0.
            console.log("adding asset input: " + assetName)
            await txBuilder.add_input(
              CardanoWasm.Address.from_bech32( changeAddress ),
              CardanoWasm.TransactionInput.new(
                CardanoWasm.TransactionHash.from_bytes(
                    Buffer.from(utxo.txix, "hex")
                ), // tx hash
                utxo.txIndex, // index
              ),
              assetsVal
            );   
          });
        };
      });
    };

    //parse out outputs and datums
    await JSON.parse( outputs ).map ( async ( output: any ) => {
      let dataHash: any;
      let hasDatum: boolean = false;
      // console.log(output);
      if( !output.assetName ){

        if(output.datums.length > 0){
          console.log("adding Datums");          
          
          datumFields = CardanoWasm.PlutusList.new();
          
          await output.datums.map( async ( datum: any ) => {
            console.log(datum);
            // datumFields.add(CardanoWasm.PlutusData.new_bytes(Buffer.from('3f7826896a48c593598465a096d63606ceb8206', 'hex|utf8')));
            // datumFields.add(CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str("22222")));             
            datum.datumType === "byte" && await datumFields.add(CardanoWasm.PlutusData.new_bytes(Buffer.from( datum.datumValue, datum.byteType )));
            datum.datumType === "int" && await datumFields.add(CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str( datum.datumValue )));
          });
          
          const tradeDetails = CardanoWasm.PlutusList.new();
          tradeDetails.add(
            CardanoWasm.PlutusData.new_constr_plutus_data(
              CardanoWasm.ConstrPlutusData.new(
                CardanoWasm.BigNum.from_str("0"),
                datumFields
              )
            )
          );
          const datumData = CardanoWasm.PlutusData.new_constr_plutus_data(
            CardanoWasm.ConstrPlutusData.new(
              CardanoWasm.BigNum.from_str(output.datums[0].constructorOuter),
              tradeDetails
            )
          );
          
          /*
          const constrDatum = CardanoWasm.ConstrPlutusData.new(
            CardanoWasm.BigNum.from_str(output.datums[0].constructorOuter),
            datumFields
          );
          datumData = CardanoWasm.PlutusData.new_constr_plutus_data(constrDatum);
          */

          dataHash = CardanoWasm.hash_plutus_data(datumData);
          
          // inline datum, redeemers and smart contracts.
          const cost_model_vals = [197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 3345831, 1, 1];
          
          const costModel = CardanoWasm.CostModel.new();
          await cost_model_vals.forEach((x, i) => costModel.set(i, CardanoWasm.Int.new_i32(x)));
          
          const costModels = CardanoWasm.Costmdls.new();
          await costModels.insert( CardanoWasm.Language.new_plutus_v1(), costModel );
          /*
          const script = "5916cd5916ca010000332332233223322332232323332223233322232333333332222222232333222323333222232323322323332223233322232323322332232323333322222332233223322332233"+
                          "22332222323232323223232232325335303833300d3333573466e1cd55cea805a400046666644444666660b600a0080060040026eb4d5d0a8059bad35742a0146eb8d5d0a8049bae35742a0106eb8d"+
                          "5d09aba2500823504e35304f3357389210350543100050499263333573466e1cd55cea802a400046644660ac0040026eb4d5d0a8029bae357426ae8940148d4138d4c13ccd5ce24810350543100050"+
                          "499263333573466e1cd55cea8012400046602064646464646464646464646666ae68cdc39aab9d500a480008cccccccccc078cd40b08c8c8cccd5cd19b8735573aa0049000119812181f9aba150023"+
                          "031357426ae8940088d4178d4c17ccd5ce249035054310006049926135573ca00226ea8004d5d0a80519a8160169aba150093335503375ca0646ae854020ccd540cdd728191aba1500733502c04835"+
                          "742a00c66a05866aa0b20a2eb4d5d0a8029919191999ab9a3370e6aae754009200023350263232323333573466e1cd55cea80124000466a05c66a08eeb4d5d0a80118261aba135744a00446a0c46a6"+
                          "0c666ae712401035054310006449926135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae7540092000233502c33504775a6ae854008c130d5d09aba250022350623530633357389201035"+
                          "054310006449926135573ca00226ea8004d5d09aba2500223505e35305f3357389201035054310006049926135573ca00226ea8004d5d0a80219a8163ae35742a00666a05866aa0b2eb88004d5d0a8"+
                          "01181f1aba135744a00446a0b46a60b666ae71241035054310005c49926135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5"+
                          "d0a8011919191999ab9a3370ea00290031181198201aba135573ca00646666ae68cdc3a801240084604460946ae84d55cf280211999ab9a3370ea006900111811181a9aba135573ca00a46666ae68c"+
                          "dc3a802240004604a6eb8d5d09aab9e50062350553530563357389201035054310005749926499264984d55cea80089baa001357426ae8940088d4138d4c13ccd5ce249035054310005049926104f13504d35304e3357389201035054350004f4984d55cf280089baa001135573ca00226ea80044d5d1280089aba25001135744a00226aae7940044dd50009109198008018011000911111111109199999999980080580500480400380300280200180110009109198008018011000891091980080180109000891091980080180109000891091980080180109000909111180200290911118018029091111801002909111180080290008919118011bac001320013550382233335573e0024a01c466a01a60086ae84008c00cd5d100101991919191999ab9a3370e6aae75400d200023330073232323333573466e1cd55cea8012400046601a60626ae854008cd404c0b4d5d09aba250022350363530373357389201035054310003849926135573ca00226ea8004d5d0a801999aa805bae500a35742a00466a01eeb8d5d09aba25002235032353033335738921035054310003449926135744a00226aae7940044dd50009110919980080200180110009109198008018011000899aa800bae75a224464460046eac004c8004d540c888c8cccd55cf80112804919a80419aa81898031aab9d5002300535573ca00460086ae8800c0b84d5d08008891001091091198008020018900089119191999ab9a3370ea002900011a80418029aba135573ca00646666ae68cdc3a801240044a01046a0526a605466ae712401035054310002b499264984d55cea80089baa001121223002003112200112001232323333573466e1cd55cea8012400046600c600e6ae854008dd69aba135744a00446a0466a604866ae71241035054310002549926135573ca00226ea80048848cc00400c00880048c8cccd5cd19b8735573aa002900011bae357426aae7940088d407cd4c080cd5ce24810350543100021499261375400224464646666ae68cdc3a800a40084a00e46666ae68cdc3a8012400446a014600c6ae84d55cf280211999ab9a3370ea00690001280511a8111a981199ab9c490103505431000244992649926135573aa00226ea8004484888c00c0104488800844888004480048c8cccd5cd19b8750014800880188cccd5cd19b8750024800080188d4068d4c06ccd5ce249035054310001c499264984d55ce9baa0011220021220012001232323232323333573466e1d4005200c200b23333573466e1d4009200a200d23333573466e1d400d200823300b375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c46601a6eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc048c050d5d0a8049bae357426ae8940248cccd5cd19b875006480088c050c054d5d09aab9e500b23333573466e1d401d2000230133016357426aae7940308d407cd4c080cd5ce2481035054310002149926499264992649926135573aa00826aae79400c4d55cf280109aab9e500113754002424444444600e01044244444446600c012010424444444600a010244444440082444444400644244444446600401201044244444446600201201040024646464646666ae68cdc3a800a400446660106eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d400920002300a300b357426aae7940188d4040d4c044cd5ce2490350543100012499264984d55cea80189aba25001135573ca00226ea80048488c00800c888488ccc00401401000c80048c8c8cccd5cd19b875001480088c018dd71aba135573ca00646666ae68cdc3a80124000460106eb8d5d09aab9e500423500a35300b3357389201035054310000c499264984d55cea80089baa001212230020032122300100320011122232323333573466e1cd55cea80124000466aa016600c6ae854008c014d5d09aba25002235007353008335738921035054310000949926135573ca00226ea8004498480048004448848cc00400c0084480048848cc00400c00880048888848ccccc00401801401000c0088004448c8c00400488cc00cc008008004cc8cc88ccc888ccc888ccc888cc88cc88ccc888cc88cc88ccc888c8cc88cc88c8c8c8c8c8cccc8888c8cc88c8c8c8c8c8c8cc88c8c8cc88cc88cc88cccccccc88888888ccccc88888c8c8c8cccc8888cc88cc88cc88cc88cc88c8c8c888c88c8c88c8c8c8c8c94cd4c13d4cd4c13cccd5cd19b8750084800014414054cd4c13cccd54c11848004d412541208004d4038488cc0094cd4c144ccc0e8d4c051401c8888888888024d4c0d00348888800ccd4164cd5417122100335059335505c4890035303400d22222005505a505a1053133573892011850726f666974204973204e6f74204265696e67205061696400052330025335305133303a35301450072222222222009500c335059335505c488100335059335505c48900337026a606801a444440086a606801a4444400aa0b4a0b420a6266ae7124011853656c6c6572204973204e6f74204265696e6720506169640005233002533530513300550095003105313357389201194275796572204e6f7420526563656976696e672056616c75650005233002533530513300f5007500910531335738920113496e636f7272656374205478205369676e65720005233002533530515006105313357389211e5370656e64696e67204d756c7469706c6520536372697074205554784f7300052001105113357389211b5468652042757920456e64706f696e7420486173204661696c65640005015335304f333573466e1d4021200205105015335304f3335530461200135049504820013500e122330025335305133005500c5003105313357389211d56616c7565204e6f742052657475726e696e6720546f2053656c6c65720005233002533530513300f5007500c10531335738920113496e636f7272656374205478205369676e65720005233002533530515006105313357389211e5370656e64696e67204d756c7469706c6520536372697074205554784f7300052001105113357389211e5468652052656d6f766520456e64706f696e7420486173204661696c65640005015335304f333573466e1d4021200405105015335304f3335530461200135049504820013500e12233002533530513303c301100850031053133573892011d56616c7565204e6f742052657475726e696e6720546f205363726970740005233002533530513300f5007500c10531335738920113496e636f7272656374205478205369676e6572000523300253353051300430110081053133573892011c456d62656464656420446174756d20497320496e636f72726563742e0005233002533530515006105313357389211e5370656e64696e67204d756c7469706c6520536372697074205554784f7300052001105113357389211e5468652055706461746520456e64706f696e7420486173204661696c656400050133573892011b416374696f6e20466c6167204e6f7420496d706c656d656e746564000501051133573892011056616c69646174696f6e204572726f7200050153353505c35300f0052235301300222222222223302a00a00b213530543530520012200122200213501d3530353357389201154e6f20496e70757420746f2056616c69646174652e00036498c8004d54198894cd4d415800441408854cd4d417cd4c158008888004854cd4d4180c8d4c05800488888888894cd4d41acccd54c1504800540b88d4d541a0004894cd4c180ccd5cd19b8f00200f0620611350700031506f002213506e35355068001220011506c5008232323232323215335350673333333574800e46666ae68cdc39aab9d5007480008cccd55cfa8039283591999aab9f50072506c233335573ea00e4a0da46666aae7d401c941b88cccd55cfa8039283791999aab9f35744a0104a66a6a0dea66a6a0dea66a6a0dea66a6a0dea66a6a0de608c6ae85403484d41c88888ccccc12801401000c008004541c0854cd4d41c0c11cd5d0a806909a83998010008a8388a83810a99a9a83818241aba1500c21350733002001150711507021533535070304835742a016426a0e660040022a0e22a0e042a66a6a0e060906ae85402884d41ccc008004541c4541c0941c012011c11811411010c941a92625069250692506925069041215335305a333573466e1cd4c0f405888888014c8c94cd4c170ccd5cd19b895001482024bd004174178540045208092f40113370600290281a981e80b1111100202e02d8a99a982d299a982d199ab9a3370e6a607a002444440086a607a02c444440080b80b620b620b82a66a60b4666ae68cdc79a981e800911110019a981e80b1111100182e02d8a99a982d199ab9a3371e6a607a002444440046a607a02c444440040b80b62666ae68cdc79a981e800911110009a981e80b1111100082e02d882d882d882d882d882d09aba25001135744a00226ae8940044d5d1280089aab9e50011375400220a6260080024466606e6a6022a00844444444440120040022660946a601ca0024444444444014900009a98058009100109a98148011100089a98140009100109a981400091111001111a98038011111111111299a9a82e199aa982289000a80f9299a9827999ab9a3371e0180020a20a026a0be0022a0bc006420a2209e2466a002a094a09646a6004002446a600c0044444444444a66a6a0b66603a014016426a60a2002446a60aa002444666aa608824002446a60b40044446a60c8010446a60cc00a44a66a60b8666608c008006004002266a0c80120102010a0b801e26a0386a606866ae712401024c66000354988848cc00400c0088004888888888848cccccccccc00402c02802402001c01801401000c008800448848cc00400c0084800448848cc00400c0084800448848cc00400c00848004484888c00c010448880084488800448004498894cccd4c01000485410885410885410884ccd54c0a84800540108d4c0dc004894cd4c0d94cd4c0d8ccd5cd19b8f35304d0022200235304d004220020380371333573466e1cd4c13400888004d4c134010880040e00dc40dc4d411800c5411400c4cd40ac894cd4d40fc0088400c400540f8848888c010014848888c00c014848888c008014848888c0040148004848888888c01c0208848888888cc018024020848888888c014020488888880104888888800c8848888888cc0080240208848888888cc00402402080044800480048848cc00400c00880048888848ccccc00401801401000c00880048ccccccd5d200092816128161281611a8169bad0022502c0042333333357480024a0564a0564a0564a05646a0586eb800800c480048004c8004d540c088894cd4d408800c40708854cd4c0754cd4c074cc88d4c0ac00888d4c0b400c88cccc03401000c008004d4c08800888800ccc0a8c0cc01140b04ccc028024d4c08800888800800c4078407c4ccc01800401000c8888c8cd4c0bc0148cd4c0c001094cd4c074ccd5cd19b8f00200101f01e15003101e201e23353030004201e25335301d333573466e3c00800407c0785400c407854cd4d40a000c854cd4d40a400884cd4c0b40088cd4c0b80088cd4c0c80088cd4c0cc0088cc06000800480848cd4c0cc00880848cc060008004888084888cd4c0c001080848894cd4c088ccd5cd19b87006003024023153353022333573466e1c01400809008c4cc038010004408c408c407054cd4d40a0004840704070c8004d540b88894cd4d407c00840648854cd4c068ccc01c018d4c07c00888800800c40704cc01400400c88ccd5cd19b8700200101801722233355300d1200135010500f235355021001223335530101200135013501223535502400122333535500e00123300a4800000488cc02c0080048cc02800520000013355300c12001235355021001223355024002333535500b00123355301012001235355025001223355028002355012001001223335550090130020012335530101200123535502500122335502800235501000100133355500400e00200111122233355300612001501d3355300b1200123535502000122335502300235500d001333553006120012235355021002225335301933355301012001323350162233353500b00322002002001353500900122001335009225335301b002101d100101a235355024001223300a00200500610031335021004003501e0013355300b120012353550200012232335502400330010053200135503122533535021001135500d00322135355026002225335301e3300c002008133550120070011300600300212212330010030021200132001355028221122253353501b0011002221330050023335530071200100500400111212223003004112212223300200500411212223001004112001320013550232211225335350150011501722133501830040023355300612001004001320013550222211222533535015001135350090032200122133353500b0052200230040023335530071200100500400122333573466e3c00800403002c4cd4014894cd4c0240084004402802448cd400c88ccd4d401800c88008008004d4d40100048800448848cc00400c0084800448848cc00400c00848004c8004d540688894cd4d402c0084ccd5cd19b87001480080180148854cd4d4050d4c02cd4c02400888004888004854cd4c01cccd5cd19b890044800802002440204cc018008cdc0002240042a66a600c666ae68cdc4801a400400e010200e26600a00200624400424400240024424660020060044002444246660020080060044002224400424424466002008006240022244246600200600422400244246600200600440022424460040062244002240024244600400644424466600200a00800640024244600400642446002006400244246600200600440022246460020024466006600400400266440042400240021;"

          const scripts = CardanoWasm.PlutusScripts.new();
          await scripts.add(CardanoWasm.PlutusScript.from_bytes(Buffer.from(script, 'hex')));
          await witnesses.set_plutus_scripts(scripts);
          */

          await txBuilder.set_script_data(tradeDetails);
          await witnesses.set_plutus_data(tradeDetails);

          // const redeemers = await CardanoWasm.Redeemers.new();
          // await witnesses.set_redeemers(redeemers);
          // const scriptDataHash = await CardanoWasm.hash_script_data( redeemers, costModels, datumFields );
          // await txBuilder.set_script_data_hash(scriptDataHash);

          console.log("calc script hash");
          console.log(await txBuilder.calc_script_data_hash(costModels));

          console.log("count missing input scripts");
          console.log(await txBuilder.count_missing_input_scripts())

          hasDatum = true;
          
        };

        hasDatum == false && console.log(`Sending: ${output.outputValue} lovelace to: ${output.outputAddress}`)
        hasDatum == true && console.log(`Sending: ${output.outputValue} lovelace to: ${output.outputAddress} AND Datum`)

        hasDatum == false ?
        await txBuilder.add_output(
          CardanoWasm.TransactionOutputBuilder.new()
          .with_address( CardanoWasm.Address.from_bech32( output.outputAddress ))
          .next()
          .with_value( CardanoWasm.Value.new( CardanoWasm.BigNum.from_str( output.outputValue )))
          .build()
        )
        :
        await txBuilder.add_output(
          CardanoWasm.TransactionOutputBuilder.new()
          .with_address( CardanoWasm.Address.from_bech32( output.outputAddress ))
          .with_data_hash(dataHash)
          .next()
          .with_value( CardanoWasm.Value.new( CardanoWasm.BigNum.from_str( output.outputValue )))
          .build()
        )
      };
    });

    // output for asset transfer , Assets will use min required coin change will be calculated after all inputs are passed
    if ( JSON.parse( outputs ).length > 0 ){
      await JSON.parse( outputs ).map ( async ( output: any ) => {
        if( output.assetName ){
          const assetsVal = CardanoWasm.Value.new( CardanoWasm.BigNum.from_str( output.outputValue ) );
          const assetMA = CardanoWasm.MultiAsset.new();
          const assetToAdd = CardanoWasm.Assets.new();
          const amount = CardanoWasm.BigNum.from_str(output.assetAmount);

          // Inserting Native token
          console.log("Adding Asset: " + output.assetName )
          await assetToAdd.insert(
            CardanoWasm.AssetName.new(Buffer.from(output.assetName, "hex")),
            amount
          );
          // Adding asset to multiasset
          console.log("Adding Asset Policy: " + output.policyID )
          await assetMA.insert(
            CardanoWasm.ScriptHash.from_bytes(Buffer.from(output.policyID, "hex")),
            assetToAdd
          );
          // Setting value with multiasset
          await assetsVal.set_multiasset(assetMA);
          console.log("Adding asset output: " + output.assetName);
          await txBuilder.add_output(
            CardanoWasm.TransactionOutputBuilder.new()
            .with_address( CardanoWasm.Address.from_bech32( output.outputAddress ))
            .next()
            .with_asset_and_min_required_coin( assetMA, CardanoWasm.BigNum.from_str('34482'))
            .build()
          );
        };
      });
    };
    
    // METADATA
    if( JSON.parse(metadata).length > 0 ){
      // MetaData stuff
      console.log('adding meta');
      const generalTxMeta = CardanoWasm.GeneralTransactionMetadata.new()
      const auxData = CardanoWasm.AuxiliaryData.new();

      await JSON.parse(metadata).map( async( meta: any) => 
        await generalTxMeta.insert(
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


    // set the time to live - the absolute slot value before the tx becomes invalid
    console.log("setting ttl");
    await txBuilder.set_ttl(txTTL);

    // calculate the min fee required and send any change to an address
    // console.log("setting change");
    console.log("setting change");
    await txBuilder.add_change_if_needed( CardanoWasm.Address.from_bech32(changeAddress) );

    // once the transaction is ready, we build it to get the tx body without witnesses
    console.log("Building and singing TX");
    let newTX = await txBuilder.build_tx();

    // add keyhash witnesses
    const txHash = await CardanoWasm.hash_transaction(newTX.body());
    const vkeyWitness = await CardanoWasm.make_vkey_witness(txHash, utxoKey.to_raw_key());
    await vkeyWitnesses.add(vkeyWitness);
    await witnesses.set_vkeys(vkeyWitnesses);

    // create the finalized transaction with witnesses
    const transaction = await CardanoWasm.Transaction.new(
      newTX.body(),
      witnesses,
      includeMeta == 1 ? newTX.auxiliary_data() : undefined, //metadata
    );

    const txHex = await Buffer.from(transaction.to_bytes()).toString("hex");
    const txBytes = await  Buffer.from(transaction.to_bytes());
    const fee: any = await txBuilder.get_fee_if_set().to_str();
    
    return(
      {
        cborHex: txHex,
        txBytes,
        fee
      }
    );
  }catch(error){
    console.log( error );
    return( error );
  };

};

export const fromHex = ( hex: any ) => Buffer.from( hex, "hex" );
export const toHex = ( bytes: any ) => Buffer.from(bytes).toString("hex");
export const toBytesNum = ( num: any ) =>
  num
    .toString()
    .split("")
    .map(( d: any ) => "3" + d)
    .join("");
export const fromAscii = (hex: any) => Buffer.from(hex).toString("hex");

