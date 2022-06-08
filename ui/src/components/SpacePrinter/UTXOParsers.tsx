import React, { useEffect, useState } from "react";
import { SpacePrinterAPI, CardanoBoxHttp, blockfrostApi, OgmiosWS } from "../../api/SpacePrinterApis";
import { makeStyles, Checkbox, FormControlLabel, Button } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { a2hex, hex2a } from "../../utils/hextools";
import { STLViewer } from "../AssetViewer/STLviewer";
import { getAssetInfo } from "../Blockfrost/BlockfrostAsset";
import { JobsOgmiosTable } from "./JobsOgmiosTable";
import { JobsBlockfrostTable } from "./JobsBlockfrostTable";

//Cardano Box Ogmios UTXO parser
export const ParseOgmiosUtxos: React.FC = ( ) => {
  const darkMode = useDarkMode();
  const useStyles = makeStyles({
    terminal: {
      width: 800,
      height: 900,
      padding: 10,
      background: `${darkMode.value ? "#fff" : "#000" }`,
      color: `${darkMode.value ? "#000" : "#0f0" }`,
      borderRadius: 10,
      border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`,
      fontFamily: "monospace",
      textAlign: "left",
      overflow: "auto",
      margin: "0 auto",
      cursor: "text"
    },
  });
  const classes = useStyles();
  const [ utxos, setUtxos ] = useState<any>();
  const [ status, setStatus ] = useState("");

  const parserUtxos = async () => {
    const address: string = `addr_test1wrxf5ul7h3sf095u8a6fsh2y9sm8lfjj26s4x9gk4mm0wvqkxf5hp`;
    const cbjwtoken: any = sessionStorage.getItem("cbjwtoken")
    let lovelaceTotal = 0;
    let parsedUtxos: any = [];
  
    try{
      OgmiosWS.send(JSON.stringify({
        type: "jsonwsp/request",
        version: "1.0",
        servicename: "ogmios",
        methodname: "Query",
        args: { "query": { "utxo": [ address ] }}
      }));
  
      OgmiosWS.onmessage = async ( msg: any ) => {
        const results: any = JSON.parse(msg.data)
        // console.log(results)
        // Promise.all()
        await results.result.map(async ( utxo: any) => {
          lovelaceTotal = lovelaceTotal + utxo[1].value.coins;
          await Object.entries(utxo[1].value.assets).map( async ( asset: any ) => {
            const policyID: string = asset[0].split(".")[0];
            const assetName: string = asset[0].split(".")[1];
            parsedUtxos.push({ "meta": await getAssetInfo( policyID+assetName ),"asset": asset[0], "assetAmount": asset[1], "TxId": utxo[0].txId, "txIndex":  utxo[0].index, "datum": utxo[1].datum });
          })
          // console.log(utxo[1].value.coins)
          parsedUtxos.push({ "TxId": utxo[0].txId, "txIndex": utxo[0].index, "datum": utxo[1].datum, "loveLace": utxo[1].value.coins  });
        });
        parsedUtxos.push( lovelaceTotal )
        setTimeout( () => {setUtxos( parsedUtxos )}, 3000);
      };
    }catch( error ){
      console.log(error);
    }
  };

  useEffect( () => {
      parserUtxos()
    }, []);

  return (    
    <>
      {
        utxos ? <JobsOgmiosTable rows={utxos}/> : <div>LOADING JOBS</div>
      } 
    </>
  ) 
};

// Blockfrost UTXO Asset Parser
export const ParseBlockfrostUtxos: React.FC = () => {
  const darkMode = useDarkMode();
  const useStyles = makeStyles({
    terminal: {
      width: 800,
      height: 900,
      padding: 10,
      background: `${darkMode.value ? "#fff" : "#000" }`,
      color: `${darkMode.value ? "#000" : "#0f0" }`,
      borderRadius: 10,
      border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`,
      fontFamily: "monospace",
      textAlign: "left",
      overflow: "auto",
      margin: "0 auto",
      cursor: "text"
    },
  });

  const classes = useStyles();
  const [ jobs, setJobs ] = useState<any>([]);
  const [ status, setStatus ] = useState("");
  const [ lovelace, setLovelace] = useState(0);

  const parseUtxos = async ( ) => {
    const address: string = `addr_test1wrxf5ul7h3sf095u8a6fsh2y9sm8lfjj26s4x9gk4mm0wvqkxf5hp`;
    const blockfrostres: any = await blockfrostApi(`https://cardano-testnet.blockfrost.io/api/v0/addresses/${address}/utxos`, "GET", "");
    // console.log(blockfrostres);
    blockfrostres.map( (utxo: any) =>{
      // console.log(utxo.amount)
      utxo.amount.map(async (unit: any)=>{
        // console.log(unit)
        let data: any = unit.unit !== "lovelace" && await blockfrostApi(`https://cardano-testnet.blockfrost.io/api/v0/assets/${unit.unit}`, "GET", "");
        unit.unit !== "lovelace" && setJobs( (jobs: any) => [...jobs,  {utxo, data} ]) ;
      })
    }); 
  };

  useEffect( () => {
    parseUtxos()
  }, []);

  return(
    <>
      { jobs && <JobsBlockfrostTable rows={jobs} / > }
    </>
  )
}
