import React, { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterHttp } from "../../api/SpacePrinterApis";

type walletProps = {
  jwToken: string,
  queryWallets: any
}

const RecoverSeed: React.FC<walletProps> = ( { jwToken, queryWallets } ) => {
  const [ walletName, setWalletName ] = useState<string>("");
  const [ passPhrase, setPassPhrase ] = useState<string>("");
  const [ seedPhrase, setSeedPhrase ] = useState<string | "">("");
  const [ walletType, setWalletType ] = useState<any>("general")
  const [ open, setOpen ] = useState<boolean>(false)
  const [ status, setStatus ] = useState("");
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setWalletName("");
    setPassPhrase("");
    setSeedPhrase("");
    setOpen(false);
  };

  const submitSeed = async () => {
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");    
    const result: any = await SpacePrinterHttp.genPrinterWallet( jwToken, userName, sessionType, walletName, seedPhrase, passPhrase, walletType );
    console.log( result );
    result.error ? setStatus( result.error ) : setStatus( result );
    queryWallets();    
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Import using Seed Phrase
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >   
        <DialogTitle id="alert-dialog-title">
          Recover wallet with seed phrase
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
              <br />
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
              <br />
              <TextField
                variant="outlined"
                margin="dense"
                required
                id="seedPhrase"
                name="seedPhrase"
                label="Seed Phrase"
                value={seedPhrase}
                fullWidth
                onChange={(event:any) => {setSeedPhrase(event.target.value)}}
              />
            </div>
            {status && status}
            <div>
              <Button variant="outlined" onClick={()=>submitSeed()}>Submit</Button> 
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

export default RecoverSeed;
