import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import PrinterTerminal from "./PrinterTerminal";
import PrinterSC from "./PrinterSC";
import PrinterWallet from "./PrinterWallet";


const PrinterInfo: React.FC = () => {
  const history = useHistory();
  const [ walletExist, setWalletExist ] = useState(false);
  const [ printerUUID, setPrinterUUID ] = useState();
  return (
    <>
      <Grid container>
        <div style={{ margin: "0 5px 0 0" }}>
          <PrinterTerminal setPrinterUUID={ setPrinterUUID } />
        </div>
        <div >
          <PrinterWallet printerUUID={printerUUID} walletExist={walletExist} setWalletExist={setWalletExist} />
        </div>
      </Grid>    
    </>
  );
};

export default PrinterInfo;
