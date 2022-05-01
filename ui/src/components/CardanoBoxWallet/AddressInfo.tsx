import React, { useState, useEffect } from "react";
import { SpacePrinterHttp, SpacePrinterWS, CardanoBoxHttp} from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { hex2a } from "../../utils/hextools";
import { getAssetInfo } from "../Blockfrost/BlockfrostAsset";
import { STLDialog } from "./STLDialog";
import { genTx } from "./GenTX";

type walletProps = {
  address: any
}

const AddressInfo: React.FC<walletProps> = ( { address  } ) => {
  const [ open, setOpen ] = useState( false );
  const [ status, setStatus ] = useState("Loading...");
  const [ assets, setAssets ]:any = useState();
  const darkMode = useDarkMode();

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const getAddressInfo = async () => {
    const sessionType: any = sessionStorage.getItem("sessionType");
    const userName: any = sessionStorage.getItem( 'userName' );
    const rjwtoken: any = sessionStorage.getItem("rjwtoken");
    const cbjwtoken: any  = sessionStorage.getItem("cbjwtoken");


  };

  const getAssetMeta = async ( asset: string ) => {
    const res: any = await getAssetInfo(asset);
    console.log( res );
    return(
       res.onchain_metadata.files && res.onchain_metadata.files.constructor == Array ? <>Yes <br/></> : <>No <br/></> 
    );
  };

  const buildTX = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    console.log( "building TX" );
    // jwToken: string, walletID: string, walletPass: string, addressName: string, utxos: string, assets:string, metadata: string, outputAddress: string, outputValue: string, changeAddress: string, txTTL: number
    const walletID = "qalxwnxgf4s97t";
    const walletPass = "bakon1983";
    const addressName = "addr";
    const outputAddress = "addr_test1qraezw6lcjtsm5hvzzcz336k9nyg0qsakkjycf8xev0hsadggghv2wfeaa0y6ame620h76vk4hnr7t9dy2ycprhyr2ds6vezcn";
    const outputValue = "5000000";
    const changeAddress = "addr_test1qzsuzrz8v7nrleyc8uvg946dzyr99608xdw5nk64l98fss06qc7n0m9a2l0rxvmgeunvkqm2zzqq8zl3yn5jwqm3t44qqudqtt";
    const txTTL = 91694786

    const utxos = JSON.stringify(
      [
        {
          txix: "12a822f7dca0cedbc5f91d03b7b948f0a63af9ddcc77e53bc9d2a3716d235b61", // TXIX
          txIndex: 0, // txIndex number
          inputValue: "6000000000"// inputValue lovelace string
        }
      ]
    )

    const assets = JSON.stringify(
      [
        // {
          //txix: "3666ccda1124849380b7a166806313a4c412de328d59d2c06863e8a03d0db4ec",
          //txIndex: 0,
          //policyID: "752d5585c4fe5981919bf31502fec4e5e1fa131d9c57623025e6e24a",   // policyID
          //assetName: "43617264616e6f426f78",  // assetName
          //assetAmount: "1" // assetAmount
        //}
      ]
    )

    const metadata = JSON.stringify(
      [
        {
          label: "420",  // label
          metadata:{
            sendfrom: "cardano box!!!!",
            msg: "Testing auto change calculation"
          }  // metadata stringified object
        }
      ]
    )

    console.log(utxos);

    const genTXRes: any = await genTx( jwtoken, walletID, walletPass, addressName, utxos, assets, metadata, outputAddress, outputValue, changeAddress, txTTL );
    console.log( genTXRes );
  };

  useEffect( ()=>{
     getAddressInfo();
     
  },[])

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div>
            {
              assets && 
              <div>
                You can has this many ADAs: ₳{assets.lovelaceSum/1000000}
              </div>
            }
            {
              assets && assets.assets ? assets.assets.map( ( asset: any, key: any ) =>
                
                <div style={{border: "1px solid #fff", margin: 5, padding: 5}}>
                  { console.log(assets) }
                  TXIX: {asset.utxo}<br />
                  ADA: ₳{ asset.lovelace/1000000 }<br />
                  { asset.policyID && "Policy ID: " + asset.policyID}<br />
                  { asset.policyID && "Asset: " + hex2a(asset.asset)}({asset.asset})<br />
                  {  asset.policyID == undefined && "No Asset with UTXO"}<br />
                  CIP-26:
                  { asset.policyID && asset.meta.files && asset.meta.files.constructor == Array ? <>Yes <br/></> : <>No <br/></> }
                  { 
                    asset.policyID && asset.meta.files && asset.meta.files.constructor == Array ? 
                    asset.meta.files.map( (asset: any, key: any) =>
                      <>         
                        Media: {asset.mediaType}
                        {  asset.mediaType === "model/stl" && <STLDialog fileUrl={`https://ipfs.io/ipfs/${asset.src[0].replace("ipfs://","")}` } fileName="" /> }
                        <br />
                      </>
                    )
                    :
                    <>
                      { asset.policyID && typeof asset.meta.files !== "undefined" && asset.meta.files.mediaType === "image/png"   && <img src={`https://ipfs.io/ipfs/${asset.meta.image.replace("ipfs://","")}`} alt="png file" height="50" /> }
                      { asset.policyID && typeof asset.meta.files !== "undefined" && asset.meta.files.mediaType === "image/jpeg"  && <img src={`https://ipfs.io/ipfs/${asset.meta.image.replace("ipfs://","")}`} alt="jpeg file" height="50" /> }
                      { asset.policyID && typeof asset.meta.files !== "undefined" && asset.meta.files.mediaType === "image/jpg"   && <img src={`https://ipfs.io/ipfs/${asset.meta.image.replace("ipfs://","")}`} alt="jpg" height="50"/> }
                      
                    </>
                    
                  }
                  
                </div>
              )
              :
              <>LOADING...</>
            
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={()=>getAddressInfo()}>Refresh</Button>
          <Button onClick={()=>buildTX()}>Build TX</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddressInfo;