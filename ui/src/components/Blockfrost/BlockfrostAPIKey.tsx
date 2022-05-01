import React, { useState } from "react";
import { Button, TextField} from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { blockfrostApi } from "../../api/SpacePrinterApis";
import { SpacePrinterHttp } from "../../api/SpacePrinterApis";

export const BlockfrostAPIKey: React.FC = ( ) => {
  const darkMode = useDarkMode();
  const [blockfrostApiKey, setBlockfrostApiKey ] = useState<any>(localStorage.getItem("blockfrostApi"));
  const [ status, setStatus ] = useState("");
  const [ viewPass ] = useState("password");

  const setKey = async () => {
    localStorage.setItem("blockfrostApi", blockfrostApiKey);
    const checkHealth: any = await blockfrostApi("https://cardano-testnet.blockfrost.io/api/v0/health", "GET");
    setStatus("saved");
    console.log(checkHealth);
  };

  const checkKey = async () => {
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    const jwToken: any = sessionStorage.getItem("jwtoken");

    const getBFKeyRes: any = SpacePrinterHttp.editConfig( jwToken, userName, sessionType, "bfAPi" );
    getBFKeyRes !== "" &&  localStorage.setItem("blockfrostApi", getBFKeyRes);
    
  };

  return(
    <>
      {
        localStorage.getItem("blockfrostApi") == undefined &&
        
        <div style={{width: 400, margin: "10 auto", boxShadow:" 0px 0px 0px 1px rgba(255, 255, 255, 0.12)", borderRadius: "4px", padding: 25 }}>
          <div></div>
          Blockfrost API Key<br />
          <div>
            <TextField
              type={viewPass}
              variant="outlined"
              margin="dense"
              required
              id="blockfrostAPIKey"
              name="blockfrostAPIKey"
              label="Blockfrost API Key"
              value={blockfrostApiKey && blockfrostApiKey}
              
              onChange={(event:any) => {setBlockfrostApiKey(event.target.value)}}
            />
          </div>
          <div>
            https://blockfrost.io/
          </div>
          <div>
            <Button onClick={()=>setKey()}>Save</Button>
          </div>
          {status && <div>{status}</div>}
        </div>
      }
    </>
  );
};
