import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { STLViewer } from "../AssetViewer/STLviewer";

type dialogProps = {
  fileUrl: string;
  fileName: string;
}

export const STLDialog: React.FC<dialogProps> = ( { fileUrl, fileName } ) => {
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
      <Button variant="outlined" onClick={handleClickOpen}>
        View STL
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