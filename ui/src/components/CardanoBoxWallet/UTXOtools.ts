import { getAssetInfo } from "../Blockfrost/BlockfrostAsset";
import { SpacePrinterHttp, SpacePrinterWS, SpacePrinterWSSend, CardanoBoxHttp, OgmiosWS, blockfrostApi } from "../../api/SpacePrinterApis";

export const parseOgmiosUtxos = async ( address: string ) => {
  const cbjwtoken: any = sessionStorage.getItem("cbjwtoken")
  let lovelaceTotal = 0;
  let utxos: any = [];
 //  address = "addr_test1qzsuzrz8v7nrleyc8uvg946dzyr99608xdw5nk64l98fss06qc7n0m9a2l0rxvmgeunvkqm2zzqq8zl3yn5jwqm3t44qqudqtt"
  try{
    OgmiosWS.send(JSON.stringify({
      type: "jsonwsp/request",
      version: "1.0",
      servicename: "ogmios",
      methodname: "Query",
      args: { "query": { "utxo": [ address ] }}
    }));

    OgmiosWS.onmessage = ( e: any ) => {
      const results: any = JSON.parse(e.data)
      // console.log(results)
      results.result.map(( utxo: any) => {
          // console.log(utxo)
          lovelaceTotal = lovelaceTotal + utxo[1].value.coins;
          Object.entries(utxo[1].value.assets).map( async ( asset: any ) => {
          // console.log(asset[0]);
          const policyID: string = asset[0].split(".")[0];
          const assetName: string = asset[0].split(".")[1];
          utxos.push({ "meta": await getAssetInfo( policyID+assetName ),"asset": asset[0]+"."+utxo[0].txId+utxo[0].index, "assetAmount": asset[1], "TxId": utxo[0].txId, "txIndex":  utxo[0].index, "utxo": utxo });
        })
        // console.log(utxo[1].value.coins)
        utxos.push({ "TxId": utxo[0].txId, "txIndex":  utxo[0].index, "datum":  utxo[1].datum, "assets":utxo[1].value.assets, "loveLace": utxo[1].value.coins  });
      });
      utxos.push( lovelaceTotal );
    };
    console.log(utxos);
    return(utxos);
  }catch( error ){
    console.log(error);
  };
};

// Blockfrost UTXO Asset Parser
export const ParseBlockfrostUtxos = async ( address: string ) => {
  // address = "addr_test1qzsuzrz8v7nrleyc8uvg946dzyr99608xdw5nk64l98fss06qc7n0m9a2l0rxvmgeunvkqm2zzqq8zl3yn5jwqm3t44qqudqtt"
  // console.log(address)
  let lovelaceTotal: number = 0;
  let utxos: any = [];
  const blockfrostres: any = await blockfrostApi(`https://cardano-testnet.blockfrost.io/api/v0/addresses/${address}/utxos`, "GET", "");
  console.log( blockfrostres );
  await blockfrostres.map( async ( utxo: any ) => {
    let utxoAsset: any = [];
    let utxoAssets: any = [];
    let utxoNaset: any = [];
    let utxoNasets: any = [];
    // console.log(utxo)
    utxo.amount[0].unit === "lovelace" && (lovelaceTotal += Number(utxo.amount[0].quantity));
    await utxo.amount.map( async ( asset: any ) => {
      // asset.unit !== "lovelace" && console.log(asset)
      asset.unit !== "lovelace" && (utxoAsset = { 
                        "assets": { ...utxoAsset.assets,
                          [`${asset.unit.slice(0,56)}.${asset.unit.slice(56)}`]: Number(asset.quantity)
                        },
                        "coins": utxo.amount[0].unit === "lovelace" && Number(utxo.amount[0].quantity)
                      }
                    );
      //row.utxo[1].value.assets
      asset.unit !== "lovelace" && utxoAssets.splice(0, 0, {});
      asset.unit !== "lovelace" && utxoAssets.splice(1, 0, { "value": utxoAsset });
      asset.unit !== "lovelace" && utxos.push({ "meta": await getAssetInfo( asset.unit ), "asset": `${asset.unit.slice(0,56)}.${asset.unit.slice(56)}.${utxo.tx_hash}${utxo.tx_index}`, "assetAmount": Number(asset.quantity), "TxId": utxo.tx_hash, "txIndex": utxo.tx_index, "utxo": utxoAssets });
    });
    await utxo.amount.map( async ( asset: any ) => {
      // asset.unit !== "lovelace" && console.log(asset)
      ( utxoNaset = { 
                        "assets": { ...utxoNaset.assets,
                          [`${asset.unit.slice(0,56)}.${asset.unit.slice(56)}`]: asset.quantity
                        }
                      }
                    );
      //row.utxo[1].value.assets
      utxoNasets.splice(0, 0, {});
      utxoNasets.splice(1, 0, { "value": utxoAsset });

    });
    utxos.push({ "TxId": utxo.tx_hash, "txIndex": utxo.tx_index, "datum": utxo.data_hash, "assets": utxoNasets[1].value.assets ? utxoNasets[1].value.assets : {}, "loveLace": utxo.amount[0].quantity });
  });
  utxos.push( lovelaceTotal );
  console.log( utxos );
  return(utxos);
};
