import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputLabel, MenuItem, FormHelperText, FormControl, Select, Button, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

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

export const SessionSelect: React.FC = () => {
  const classes = useStyles();
  const [sesstionType, setSessionType] = useState(sessionStorage.getItem("sessionType"));
  const [ ogmiosURI, setOgmiosURI ] = useState("");
  const [ ogmiosPort, setOgmiosPort ] = useState("");
  const [ kupoURI, setKupoURI ] = useState("");
  const [ kupoPort, setKupoPort ] = useState("");
  const [ status, setStatus ] = useState("");
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSessionType(event.target.value as string);
    event.target.value !== "cardanobox" && sessionStorage.setItem("sessionType", event.target.value as string)
  };

  const setSelfHostParams = () => {
    if( ogmiosURI == "" ){ return(setStatus( "Provide Ogmios URI" )) };
    sesstionType === "cardanobox" && sessionStorage.setItem("ogmiosURI", ogmiosURI);
    sesstionType === "cardanobox" && sessionStorage.setItem("ogmiosPort", ogmiosPort);
    sesstionType === "cardanobox" && sessionStorage.setItem("kupoURI", kupoURI);
    sesstionType === "cardanobox" && sessionStorage.setItem("kupoPort", kupoPort);
    sessionStorage.setItem("sessionType", "cardanobox");
  };

  return (
    <div style={{width: 400, margin: "10 auto", boxShadow:" 0px 0px 0px 1px rgba(255, 255, 255, 0.12)", borderRadius: "4px", padding: 25 }}>
      <div className={classes.formControl}>
        <FormControl className={classes.formControl}>
          <InputLabel id="sessionTypeLabel">Session Type</InputLabel>
          <Select
            labelId="sessionTypeLabel"
            id="sessionTypeSelect"
            value={sesstionType}
            onChange={handleChange}
          >
            <MenuItem value="cardanobox">CardanoBox(Self Host)</MenuItem>
            <MenuItem value="blockfrost">Blockfrost</MenuItem>
          </Select>
        </FormControl>
      </div>
      {sesstionType && sesstionType === "cardanobox" && 
      <div>
        <div>
        <TextField
            variant="outlined"
            margin="dense"
            required
            id="ogmiosURI"
            name="ogmiosURI"
            label="Ogmios URI"
            value={ogmiosURI}
            onChange={(event:any) => {setOgmiosURI( event.target.value )}}
            style={{ height: "50px", width: "67%" }}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            id="ogmiosPort"
            name="ogmiosPort"
            label="Ogmios Port"
            value={ogmiosPort}
            onChange={(event:any) => {setOgmiosPort( event.target.value )}}
            style={{ height: "50px", width: "33%" }}
          />
        </div>
        <div>
          Optional<br />
          <TextField
              variant="outlined"
              margin="dense"
              required
              id="kupoURI"
              name="kupoURI"
              label="Kupo URI"
              value={kupoURI}
              onChange={(event:any) => {setKupoURI( event.target.value )}}
              style={{ height: "50px", width: "67%" }}
          />
          <TextField
              variant="outlined"
              margin="dense"
              required
              id="kupoPort"
              name="kupoPort"
              label="Kupo Port"
              value={kupoPort}
              onChange={(event:any) => {setKupoPort( event.target.value )}}
              style={{ height: "50px", width: "33%" }}
          />                   
        </div>
        <div>  
          <Button onClick={()=>setSelfHostParams()}>Save</Button>
          {status && <div>{status}</div>}
        </div>
      </div>
      }
    </div>
  );
};
