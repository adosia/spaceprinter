import React from "react";
import { MuiThemeProvider, Typography, CssBaseline, Grid } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import { useTranslation } from "react-i18next";
import NavBar from "../../components/NavBar/NavBar";
import "./MyApp.css";

const MyApp: React.FC = () => {
  const darkMode = useDarkMode();
  const { t } = useTranslation();
  const theme = darkMode.value ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <NavBar />
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <CssBaseline />
      </div>
    </MuiThemeProvider >
  );
};

export default MyApp;
