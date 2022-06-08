import React, { useState, useEffect } from "react";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { TextField, Button, makeStyles } from "@material-ui/core"; 
import useDarkMode from "use-dark-mode";
import GenPrinterWallet from "./GenPrinterWallet";
import PrinterWalletAddress from "./PrinterWalletAddress";

type PrinterProps = {
  printerUUID: any,
  walletExist: any,
  setWalletExist: any,
}

const PrinterWallet:React.FC<PrinterProps> = ({ printerUUID, walletExist, setWalletExist }) => {
  const [ printerCMD, setPrinterCMD ] = useState<string>("");
  const [ status, setStatus ] = useState();
  const [ wallets, setWallets ] = useState([]);
  const darkMode = useDarkMode();  

  const useStyles = makeStyles({
    wallet: {
      width: 800,
      height: 300,
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

  const queryPrinterWallet = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const walletsResult: any = await SpacePrinterAPI.getCBWallets( jwtoken, userName, sessionType, "" );
    console.log(walletsResult);
    walletsResult.map((wallet: any )=>{
      if(wallet.walletType == "printer"){ 
        walletsResult.length > 0 && setWallets(walletsResult)
        walletsResult.length > 0 && setWalletExist(true)
        walletsResult.length > 0 && sessionStorage.setItem("walletExists", "true");

      }
    });
  };

  useEffect(()=>{
    queryPrinterWallet();
  }, [])

  return (
    <div style={{width: 800}}>
      Printer Wallet: 
      <div className={classes.wallet} >
        {
          walletExist == true ?
          wallets.map(( wallet: any )=> 
          wallet.walletType == "printer" &&
          <>
            Printer Wallet: { wallet.walletName }<br />
            <PrinterWalletAddress walletID={ wallet.walletID } />
          </>
          
          )
        :
          <>
            <div>To become part of the Adosia Space Printer program, you will need a wallet for your printer. Cardano Box wallet can help you integrate that.</div><br />
            <div>Before you can create a printer wallet, please connect your 3D printer to Cardano Box, then go ahead and press connect, if you're having problems connecting</div><br />
            <div>Simply refresh the browser page(This is a work around for a bug) Then type in M115 in the command and watch for your UUID in this window.</div><br />
            <div>If you see your UUID in this window a button should show up to generate your Printer wallet and address.</div><br />
            {
              printerUUID !== undefined && <div>Your UUID: { printerUUID }</div>
            }
          </>
        }
      </div>
      <>
        {
          printerUUID !== undefined && walletExist == false &&
        <div>
          <GenPrinterWallet queryWallets={queryPrinterWallet} uuid={printerUUID} />
        </div>
        }
      </>
    </div>
  ) 
}

export default PrinterWallet;