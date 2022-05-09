import React, { useState, useEffect } from "react";
import { SpacePrinterHttp, SpacePrinterWS, CardanoBoxHttp} from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Theme, TextField  } from "@material-ui/core";
import { hex2a } from "../../utils/hextools";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import BathtubIcon from '@material-ui/icons/Bathtub';
import { AccountAssetsTable } from './AccountAssetsTable';
import { AccountUTXOsTable } from "./AccountUTXOsTable";
import { parseOgmiosUtxos, ParseBlockfrostUtxos} from "./UTXOtools";
import { TxPreview } from "./TxPreview";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

type AccountTabsProps = {
  jwToken: string
  address: any,
  accountName: any,
  walletID: any
}

export const AccountTabs: React.FC< AccountTabsProps> = ({ jwToken, address, accountName, walletID }) => {
  const useStyles = makeStyles(( theme: Theme ) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [ open, setOpen ] = useState( false );
  const [ parsedUtxos, setParsedUtxos ]:any = useState();
  const [ utxos, setUtxos ]: any = useState([]);
  const [ utxoCheck, setUtxocheck ]: any = useState({});
  const [ assetCheck, setAssetcheck ]: any = useState({});
  const [ outputs, setOutputs ]: any = useState([]);
  const [ outputAddress, setOutputAddress ]: any = useState("");
  const [ outputLovelace, setOutputlovelace ]: any = useState("");
  const [ walletPassword, setWalletPassword ] : any = useState("");
  const [ txTTL, setTxTTL ]: any = useState(91694786);

  const handleClickOpen = async () => {
    setUtxocheck({});
    setAssetcheck({});
    setUtxos([]);
    setOutputs([]);
    setOutputlovelace(0);
    setOutputAddress("");
    setParsedUtxos();
    setWalletPassword("");
    getAddressInfo();
    setOpen(true);
    // console.log(asset);   
    // getWalletAccounts();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const getAddressInfo = async () => {
    
    const praseUtxoRes: any = await parseOgmiosUtxos(address)
    // const parseUtxoBFRes: any = await ParseBlockfrostUtxos(address);

    setTimeout( () => { 
      setParsedUtxos(praseUtxoRes);
    }, 3000) ;
    // console.log(praseUtxoRes);
    // const nftSearchRes: any = await CardanoBoxHttp.nftSearch( jwToken, "1", "1" );
    // console.log(nftSearchRes);
  };

  const updateLovelaceOutput = async () => {
    let exists = 0;
    await outputs.map(( output: any, key: any )=> {
      console.log(output)
      if (output.id == "lovelace" && output.outputAddress == outputAddress){
      outputs[key].outputValue = outputLovelace
      exists = 1
    }});
    exists == 0 && 
    setOutputs( [ ...outputs,
      {
      id: "lovelace",
      outputAddress: outputAddress,
      outputValue: outputLovelace,
      datums: [
                { "constructorOuter": "0" },
                { "constructorFields" : "0" },
                // { "datumType": "byte", datumValue: "", "byteType": "hex" },
                { "datumType": "int", datumValue: "42", "byteType": "" },
                { "datumType": "int", datumValue: "42", "byteType": "" },

                // { "datumType": "byte", datumValue: "466972654e4654", "byteType": "hex" },
              ],
    }])
  };

  const inputs = () => {
    return (
      <div>
        <TextField
          autoFocus
          variant="outlined"
          type="text"
          margin="dense"
          required
          id="outputAddress"
          name="outputAddress"
          label="Send to Address"
          value={outputAddress}
          onChange={(event:any) => {setOutputAddress( event.target.value )}}
          style={{ height: "50px", width: "100%" }}
        />
        <TextField
          variant="outlined"
          type="number"
          margin="dense"
          required
          id="outputLoveace"
          name="outputLovelace"
          label="Amount Lovelace to send"
          value={outputLovelace}
          onChange={( event:any ) => { setOutputlovelace( event.target.value ); event.target.value !== "" && updateLovelaceOutput(); }}
          style={{ height: "50px", width: "100%" }}
          disabled={outputAddress.length < 108  && true} // 103 mainnet
          onBlur={ () =>  outputLovelace !== "" && updateLovelaceOutput() }
        />
        <TextField
          variant="outlined"
          type="password"
          margin="dense"
          required
          id="walletPassword"
          name="walletPassword"
          label="Wallet Password"
          value={walletPassword}
          onChange={(event:any) => {setWalletPassword( event.target.value )}}
          style={{ height: "50px", width: "100%" }}
          disabled={outputLovelace < 1000000 && true}
        />
      </div>
    )
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
        maxWidth="xl"
      >   
        <DialogTitle id="alert-dialog-title">
          Accounts for wallet: <br />
        </DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                <Tab label="Assets" icon={<BathtubIcon />} {...a11yProps(0)} />
                <Tab label="UTXOs" icon={<BathtubIcon />} {...a11yProps(1)} />
                <Tab label="Transaction" icon={<BathtubIcon />} {...a11yProps(2)} disabled= { utxos.length === 0 && outputs.length === 0 ? true : false  } />
                <Tab label="Pools" icon={<BathtubIcon />} {...a11yProps(3)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              { parsedUtxos ? <AccountAssetsTable rows={parsedUtxos} utxos={utxos} setUtxos={setUtxos} utxoCheck={utxoCheck} setUtxocheck={setUtxocheck} outputs={outputs} setOutputs={setOutputs} assetCheck={assetCheck} setAssetcheck={setAssetcheck} outputAddress={outputAddress} outputLovelace={outputLovelace} /> : <>LOADING...</>}
              {inputs()}
            </TabPanel>
            <TabPanel value={value} index={1}>
              { parsedUtxos ? <AccountUTXOsTable rows={parsedUtxos} utxos={utxos} setUtxos={setUtxos} utxoCheck={utxoCheck} setUtxocheck={setUtxocheck} outputs={outputs} setOutputs={setOutputs} assetCheck={assetCheck} setAssetcheck={setAssetcheck} /> : <>LOADING...</> }
              {inputs()}
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TxPreview jwToken={jwToken} walletID={walletID} accountName={accountName} address={address} utxos={utxos} setUtxos={setUtxos} utxoCheck={utxoCheck} setUtxocheck={setUtxocheck} outputs={outputs} setOutputs={setOutputs} assetCheck={assetCheck} setAssetcheck={setAssetcheck} walletPassword={walletPassword} outputAddress={outputAddress} outputLovelace={outputLovelace} getAddressInfo={getAddressInfo} />                       
            </TabPanel>
            <TabPanel value={value} index={3}>
              Coming Soon
            </TabPanel>
          </div>
        </DialogContent>
        <DialogActions>
          <div style={{textAlign: "left", }} >
            Before you can send any assets or Lovelaces please specify the delivery address and at least 1,000,000 Lovelaces<br />
            Of course you don't have to send any assets, you can just porivde a delivery address and amount of Lovelaces you would like to send.<br />
            During this testing phase when selectin assets to send the UTXOs containing the assets will be automatically chosen.
          </div>
          <div>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}