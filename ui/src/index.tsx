import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage     from "./containers/HomePage/HomePage";
import LoadingPage  from "./containers/LoadingPage/LoadingPage";
import CreateUserPage from "./containers/CreateUserPage/CreateUserPage";
import LoginPage    from "./containers/LoginPage/LoginPage";
import PrinterPage  from "./containers/SpacePrinterPage/PrinterPage";
import SlicerPage   from "./containers/SlicerPage/SlicerPage";
import CardanoBoxWalletPage from "./containers/CardanoBoxWalletPage/CardanoBoxWalletPage";
import AdosiaMarketPlacePage from "./containers/AdosiaMarketPlacePage/AdosiaMarketPlacePage";
const jwtoken = sessionStorage.getItem( 'jwtoken');

const routing = (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
           { jwtoken ? <HomePage /> : <LoadingPage />}
        </Route>
        <Route path="/LoadingPage">
          <LoadingPage />  
        </Route> 
        <Route path="/CreateUserPage">
          <CreateUserPage />  
        </Route> 
        <Route path="/LoginPage">
          <LoginPage />  
        </Route> 
        <Route path="/HomePage">
          <HomePage />  
        </Route>
        <Route path="/PrinterPage">
          <PrinterPage />  
        </Route>
        <Route path="/SlicerPage">
          <SlicerPage />
        </Route>
        <Route path="/CBWalletPage">
          <CardanoBoxWalletPage />
        </Route>
        <Route path="/AdosiaMarketPlacePage">
          <AdosiaMarketPlacePage />
        </Route>
      </Switch>
    </BrowserRouter>
  )

ReactDOM.render(
    routing, document.getElementById("root")
  );
  