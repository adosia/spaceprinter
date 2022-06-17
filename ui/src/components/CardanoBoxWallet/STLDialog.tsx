import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { STLViewer } from "../AssetViewer/STLviewer";

type dialogProps = {
  fileUrl: string;
  fileName: string;
  stlName: string;
}

export const STLDialog: React.FC<dialogProps> = ( { fileUrl, fileName, stlName } ) => {
  const [ open, setOpen ] = useState( false );
  const darkMode = useDarkMode();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} style={{ minWidth: 100 }}>
        {stlName !== "" ? stlName : "View STL"}
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
        </DialogTitle>
        <DialogContent>
          <STLViewer fileUrl={ fileUrl } fileName={ fileName } /> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
