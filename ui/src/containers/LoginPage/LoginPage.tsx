import React from "react";
import {MuiThemeProvider, CssBaseline, makeStyles, createStyles, Theme } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import SessionSelect from "../../components/SessionSelect/SessionSelect";
import header from "../../assets/spaceprinter_logo_V1.png"
import "./LoginPage.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center"
    }
  }),
);

const LoginPage: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <div style={{textAlign: "center"}}>
          <img src={header} width="500" /> 
        </div>
        <div></div>
        <div>
          <SessionSelect />
        </div>
      </div>
    </MuiThemeProvider >
  );
};

export default LoginPage;
