import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import PrinterTerminal from "./PrinterTerminal";
import PrinterSC from "./PrinterSC";
import PrinterWallet from "./PrinterWallet";


export const AdosiaMarketPlace: React.FC = () => {
  const history = useHistory();
  const [ walletExist, setWalletExist ] = useState(false);
  const [ printerUUID, setPrinterUUID ] = useState();
  return (
    <>
      {
        sessionStorage.getItem("walletExists") === "true" &&
        <div >
          <PrinterSC /> 
        </div>
      }
    </>
  );
};

