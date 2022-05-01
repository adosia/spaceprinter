import React from 'react';
import { Button, ButtonBase } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ChangeDeviceName } from "../ChangeDeviceName/ChangeDeviceName";
import { Wifi } from "../Wifi/Wifi";
import { GetUpdates } from "../GetUpdates/GetUpdates";
import sbicon from "../../assets/sp_icon_logo_V1.png"

export const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <ButtonBase aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Device Settings
      </ButtonBase>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem><ChangeDeviceName /></MenuItem>
        <MenuItem><Wifi /></MenuItem>
        <MenuItem><GetUpdates /></MenuItem>
      </Menu>
    </div>
  );
}
