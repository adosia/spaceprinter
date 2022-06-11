import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI, blockfrostApi } from "../../api/SpacePrinterApis";
import { makeStyles, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip, ButtonBase } from '@material-ui/core';

export const UpdateBlockfrostKey = () => {
  const [ open, setOpen ]: any = useState();
  const [ status, setStatus ]: any = useState();
  const [blockfrostApiKey, setBlockfrostApiKey ] = useState<any>(localStorage.getItem("blockfrostApi"));
  const [ newKey, setNewKey ] = useState<string>("");
  const [ viewKey, setViewKey ] = useState("password");
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setKey = async () => {
    localStorage.setItem("blockfrostApi", newKey);
    const checkHealth: any = await blockfrostApi("https://cardano-testnet.blockfrost.io/api/v0/health", "GET", "");
    await saveKeyDB();
    setStatus("saved");
    console.log(checkHealth);
  };

  const saveKeyDB = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const configRes: any = await SpacePrinterAPI.editConfig( jwtoken, userName, sessionType, "" );
    configRes.blockfrostApiKey = newKey;
    console.log(configRes);    
    const saveConfig = await SpacePrinterAPI.editConfig( jwtoken, userName, sessionType, JSON.stringify(configRes) );
    console.log(saveConfig);
  };

  useEffect(
    ()=>{

    }
  );

  return (
    <div>
      <ButtonBase onClick={handleOpen}>
         Update Blockfrost Key
      </ButtonBase>
      <Dialog 
          onClose={handleClose} 
          aria-labelledby="simple-dialog-title" 
          open={open}
        >
        <DialogTitle id="simple-dialog-title">
          Update Blockfrost Key
        </DialogTitle>
  
        <DialogContent>
          <div>
            Current Key: { blockfrostApiKey }
          </div>
          <hr/>
          <div>
            Set New Key
          </div>
          <div>
            <TextField
              type={viewKey}
              variant="outlined"
              margin="dense"
              required
              id="blockfrostAPIKey"
              name="blockfrostAPIKey"
              label="Blockfrost API Key"
              value={newKey && newKey}
              onChange={(event:any) => {setNewKey(event.target.value)}}
            />
          </div>
          <div>
            <Button onClick={()=>setKey()}>
              Save Key
            </Button> 
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
