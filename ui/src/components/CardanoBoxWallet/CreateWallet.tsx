import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterHttp } from "../../api/SpacePrinterApis";
import { useHistory } from "react-router-dom";

type walletProps = {
  jwToken: string,
  queryWallets: any,
}

const CreateWallet:React.FC<walletProps> = ( { jwToken, queryWallets } ) => {
  const [ walletName, setWalletName ] = useState<string>("");
  const [ passPhrase, setPassPhrase ] = useState<string>("");
  const [ walletType, setWalletType ] = useState<any>("general")
  const [ status, setStatus ] = useState<any>();
  const [ seedPhrase, setSeedPhrase ] = useState("");
  const [ open, setOpen ] = useState<boolean>(false)
  const history = useHistory();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setWalletName("");
    setPassPhrase("");
    setStatus("");
    setSeedPhrase("");
    queryWallets();
    setOpen(false);
  };

  const createWallet = async () => {
    if(walletName === "" ) { return setStatus("Please enter wallet name."); };
    if(passPhrase === "" ) { return setStatus("Please enter password."); };
    if(passPhrase.length < 10){return setStatus("Password needs to be 10 character or longer."); };
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const result: any = await SpacePrinterHttp.genPrinterWallet( jwToken, userName, sessionType, walletName, "", passPhrase, walletType );
    result == "authError" && history.push("/LoginPage");
    console.log( result );
    result && result.seed ? setSeedPhrase( result.seed ) : setStatus( result.error );
  }; 

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Wallet
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
            value={walletName}
            fullWidth
            onChange={(event:any) => {setWalletName(event.target.value)}}
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

export default CreateWallet;
