import { SpacePrinterHttp, SpacePrinterWS, CardanoBoxHttp} from "../../api/SpacePrinterApis";

export const genTx = async ( jwToken: string, walletID: string, walletPass: string, addressName: string, utxos: string, assets:string, metadata: string, outputAddress: string, outputValue: string, changeAddress: string, txTTL: number ) => {
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const genTxResult: any = await SpacePrinterHttp.genGruntTX(
        jwToken,
        userName,
        sessionType,
        walletID,
        walletPass,
        addressName,
        utxos, // [{ txix: string, txIndex: number, inputValue: string }]
        assets, // [{ policyID: string, assetName: string, assetAmount: string }]
        metadata, // [{ label: string, metadata: stringified object }]
        outputAddress,
        outputValue,
        changeAddress,
        txTTL
    );

    console.log(genTxResult);
    return(genTxResult);
  };