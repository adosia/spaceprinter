import React, { useEffect, useState } from "react";
import { SpacePrinterAPI, CardanoBoxHttp } from "../../api/SpacePrinterApis";
import useDarkMode from "use-dark-mode";

type PrinterProps = {
  walletID: any
}

const PrinterWalletAddress:React.FC<PrinterProps> = ({ walletID }) => {
  const darkMode = useDarkMode();  
  const [ addresses, setAddresses ] = useState<any>([]);

  const getWalletAddreses = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    try{
      const walletsAddresesResult: any = await SpacePrinterAPI.getCBWallets( jwtoken, userName, sessionType, walletID );
      console.log(walletsAddresesResult);
      setAddresses( walletsAddresesResult )
    }catch (error ){
      console.log(error);
    }
  };
  
  useEffect( () => {
    getWalletAddreses()
  }, []);

  return(
    <>
      { 
        addresses ?       
          addresses.map(( address: any ) =>
            <>
            Address: { address.enterpriseAddr } <br />
            Current Job: None
            </>
          ) :
          "Fetching wallet address info"
      }
    </> 
  )
}

export default PrinterWalletAddress;
