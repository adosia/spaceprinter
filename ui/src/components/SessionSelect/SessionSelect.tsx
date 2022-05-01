import React from 'react';
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputLabel, MenuItem, FormHelperText, FormControl, Select, Button } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterHttp, SpacePrinterWS, SpacePrinterWSSend, CardanoBoxHttp } from "../../api/SpacePrinterApis";
import { BlockfrostAPIKey } from "../Blockfrost/BlockfrostAPIKey";
import { CBLoginPage, BFLoginPage } from "../LoginPages/LoginPages";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      textAlign: "center",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

const SessionSelect: React.FC = () => {
  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const [sesstionType, setSessionType] = React.useState(sessionStorage.getItem("sessionType"));
  const [ status, setStatus ] = React.useState("");
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSessionType(event.target.value as string);
    sessionStorage.setItem("sessionType", event.target.value as string)
  };

  return (
    <>
      <div style={{textAlign: "center"}}>
        { sesstionType === "cardanobox" && 
        <div>
          <div>  
            <CBLoginPage />
          </div>
          <div>
            <BlockfrostAPIKey />
          </div>
        </div>
        }
        { sesstionType === "blockfrost" && 
        <div>
          <div>
            <BFLoginPage />
          </div>
          <div>
            <BlockfrostAPIKey />
          </div>
        </div>
        }
        <div>
          {status && <div>{ status }</div>}
        </div>
      </div>
      <div className={classes.formControl}>
        <FormControl className={classes.formControl}>
          <InputLabel id="sessionTypeLabel">Session Type</InputLabel>
          <Select
            labelId="sessionTypeLabel"
            id="sessionTypeSelect"
            value={sesstionType}
            onChange={handleChange}
          >
            <MenuItem value="cardanobox">CardanoBox</MenuItem>
            <MenuItem value="blockfrost">Blockfrost</MenuItem>
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default SessionSelect;
