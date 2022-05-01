import React, { useState } from "react";
import { SpacePrinterHttp } from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { hex2a } from "../../utils/hextools";
import GenWalletAccount from "./GenWalletAccount";
import AddressInfo from "./AddressInfo";

type walletProps = {
  walletInfo: any
}

const WalletInfo: React.FC<walletProps> = ( { walletInfo } ) => {
  const [ open, setOpen ] = useState( false );
  const [ walletAccounts, setWalletAccounts ]: any = useState([]);
  const darkMode = useDarkMode();

  const handleClickOpen = () => {
    setOpen(true);
    getWalletAccounts();
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const getWalletAccounts = async () => {
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const walletAccRes: any = await SpacePrinterHttp.getCBWallets( jwtoken, userName, sessionType, walletInfo.walletID );
    console.log(walletAccRes);
    setWalletAccounts(walletAccRes);
  };

  const delWalletAccount = async ( accountName: string ) => {
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const delRes: string = await SpacePrinterHttp.delCBWallet( jwtoken, userName, sessionType, walletInfo.walletID, accountName );
    console.log(delRes);
    getWalletAccounts();
  };

  return (
    <>
      <Button color="primary" onClick={handleClickOpen}>
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
          Name: { walletInfo.walletName }<br />
          Type: { walletInfo.walletType }
        </DialogTitle>
        <DialogContent>
          <div> 
          { walletAccounts.length == 0 && <div>Your wallet doesn't have any accounts in it, please generate an account.</div> }       
            {
              walletAccounts && 
              walletAccounts.map((account: any, key: any )=> 
              <div style={{border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 5, overflow: "hidden"}}>
                  <div>
                    Account Name: { account.accountName }<br />
                    Account Address: { account.baseAddr }<br />
                    Enterprise: { account.enterpriseAddr }<br />
                    Created on: { new Date(account.timeCreated*1000).toLocaleTimeString("en-US")} | { new Date(account.timeCreated*1000).toLocaleDateString("en-US") }
                  </div>
                  <div>
                  <AddressInfo address={account.baseAddr} />
                  </div>
                  { /* <div><Button onClick={ ()=>delWalletAccount( account.accountName ) }>Delete Account</Button></div> */ }
                </div>
              )
            }
          </div>       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WalletInfo;