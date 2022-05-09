import { SpacePrinterHttp, SpacePrinterWS, CardanoBoxHttp} from "../../api/SpacePrinterApis";

export const genTx = async ( jwToken: string, walletID: string, walletPass: string, accountName: string, utxos: string, assets:string, metadata: string, outputs: string, changeAddress: string, txTTL: number ) => {
     
    const genTxResult: any = await SpacePrinterHttp.genGruntTX(
        jwToken,
        walletID,
        walletPass,
        accountName,
        utxos, // [{ txix: string, txIndex: number, inputValue: string }]
        assets, // [{ policyID: string, assetName: string, assetAmount: string }]
        metadata, // [{ label: string, metadata: stringified object }]
        outputs, // [{ outputAddress: string, outputValue: string, datums: [{ "datumType": "byte"|"int", datumValue: string, "byteType": "hex"|"utf8" }] }]
        changeAddress, // where unused assets or lovelace from UTXO should go to
        txTTL
    );

    console.log(genTxResult);
    return(genTxResult);
  };