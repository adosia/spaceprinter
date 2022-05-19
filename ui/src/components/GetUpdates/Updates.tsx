import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";


export const Updates: React.FC = () => {
  const darkMode = useDarkMode();
  const drawerWidth = 265;
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      main: {
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          borderRadius: 5, 
          padding: 5, 
          overflow: "hidden", 
          justifyContent: "center", 
          alignItems: "center", 
          textAlign: "center",
          maxWidth: 700,
        },
      },
    })
  )

  const theme = darkMode.value ? darkTheme : lightTheme;
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.5.1-beta</strong>:<br/>
        -UI Fixes and enhancements.<br />
        -Wallet Fixes for properly selecting UTXOs and Assets and creating outputs.<br/>
        -Need to check confirm cehckbox for default restore.<br />
        -Popup confirmation when deleting wallet.
        <br /><br />
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.5-beta</strong>:<br/>
        -Cardano Box wallet ported with full blockfrost support.<br />
        -ReWorked menus(Need input)
        -Several bugs and errors now have try/catch blocks to prevent memory or hangups when function errors.
        <br /><br />
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.4-beta</strong>:<br/>
        -Working CSL(Cardano Serialization Library) transaction builder imported from Cardano Box. Allows for creating TXs to interact with Smart Contracts.<br />
        -Headless setup through editing hlConfig.json that's on the device space printer image has been burned to.<br />
        -Auto detect for external DSI or HDMI monitor. Monitor/Screen has to be attached before powering on device.<br />
        <br /><br />
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>BETA V.03</strong>:<br/>
          New Settings Menu.<br />
          Give device a unique name for easier managment.<br />
          WiFi Connection GUI(Not Tested with 5Ghz Networks).
        <br /><br />
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>BETA V.02</strong>:<br/>
        Support for multi devices
        <br /><br />
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>BETA V.01</strong>:<br/>
        Rebased on new kernel and distro for better streamlining and gettings RC1 ready.
        <br /><br />
      </div>
    </>
  );
};
