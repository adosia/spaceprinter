import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI, CardanoBoxHttp } from "../../api/SpacePrinterApis";

interface WalletProps {
  queryWallets: any,
  uuid: any,
}

const GenPrinterWallet:React.FC<WalletProps> = ( { queryWallets, uuid } ) => {
  const [ passPhrase, setPassPhrase ] = useState<string>("");
  const [ walletType, setWalletType ] = useState<any>("printer")
  const [ status, setStatus ] = useState<any>();
  const [ seedPhrase, setSeedPhrase ] = useState("");
  const [ open, setOpen ] = useState<boolean>(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPassPhrase("");
    setStatus("");
    setSeedPhrase("");
    queryWallets();
    setOpen(false);
  };

  const createWallet = async () => {
    if(passPhrase === "" ) { return setStatus("Please enter password."); };
    if(passPhrase.length < 10){return setStatus("Password needs to be 10 character or longer."); };
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    try{
      const result: any = await SpacePrinterAPI.genPrinterWallet( jwtoken, userName, sessionType, uuid, "", passPhrase, walletType );
      console.log( result );
      // queryWallets();
      result && result.seed ? setSeedPhrase( result.seed ) : setStatus( result.error );
    }catch (error){
      console.log(error)
    };
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Printer Wallet
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >   
      <DialogTitle id="alert-dialog-title">
        New Wallet
      </DialogTitle>
      <DialogContent>
      <div style={{border:"1px dashed #fff", padding: 5}}>
        <div>
          <TextField
            variant="outlined"
            margin="dense"
            required
            id="walletName"
            name="walletName"
            label="Wallet Name"
            value={uuid}
            fullWidth
            disabled
          />
          <TextField
            type="password"
            variant="outlined"
            margin="dense"
            required
            id="passPhrase"
            name="passPhrase"
            label="Password"
            value={passPhrase}
            fullWidth
            onChange={(event:any) => {setPassPhrase(event.target.value)}}
          />
        </div>
        { 
          seedPhrase && 
          <div>
            <span style={{color: "red", fontWeight: "bold"}}>Makes sure you record this seed Phrase, once this window disapears it will be none recoverable you HAVE BEEN WARNED.</span><br/><br/> 
            <div>
            Phrase:<br />  
            { seedPhrase }
            </div>
          </div>       
        }
        { status && <div>{status}</div> }
        <br />
        <div>
          <Button variant="outlined" onClick={()=>createWallet()}>Submit</Button> 
        </div>
      </div>
      </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenPrinterWallet;
