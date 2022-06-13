import React, { useEffect, useState } from "react";
import { SpacePrinterAPI, blockfrostApi, OgmiosWS } from "../../api/SpacePrinterApis";
import { makeStyles, Checkbox, FormControlLabel, Button } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { a2hex, hex2a } from "../../utils/hextools";
import { STLViewer } from "../AssetViewer/STLviewer";
import { getAssetInfo } from "../Blockfrost/BlockfrostAsset";
import { ParseBlockfrostUtxos, ParseOgmiosUtxos } from "./UTXOParsers";

const PrinterSC: React.FC = () => {
  const darkMode = useDarkMode();
  const session: any = sessionStorage.getItem("sessionType");

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
  return(
    <>
      Print Jobs Available: 
      <div >
        { session === "cardanobox" && <ParseOgmiosUtxos /> }
        { session === "blockfrost" && <ParseBlockfrostUtxos /> }
      </div>
    </>
  )
}

export default PrinterSC;
