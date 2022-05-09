const { exec } = require('child_process');
import { getConfig } from "../utils/config";
import fs from 'fs';
import editConfig from "./editConfig";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const initDevice: any = async () => {
  const config: any = await getConfig();
  const network: string = config.network;
  const autoStartNode: boolean = config.autoStartNode;
  autoStartNode == true && await startSlicer();
  connectWiFi();
  saveBlockFrostApi();
};

const startSlicer = async(  ) => {
  console.log(`Starting gs server for slicer`);
  const cmdStartSlicer: string = "sudo systemctl start grid-apps.service";
  try{
    exec( cmdStartSlicer, { "encoding":"utf8" } );
  }catch( error ){
    console.log( error )
  };
};

const connectWiFi = async () => {
  const hlConfig:any = fs.readFileSync('/boot/firmware/hlConfig.json', 'utf8');
  console.log(JSON.parse(hlConfig));
  if(JSON.parse(hlConfig).wifiEnabled == 1){
    console.log("Connecting to WiFi: " + JSON.parse(hlConfig).ssid);
    const cmdConnWifi: string = `sudo nmcli dev wifi connect ${JSON.parse(hlConfig).ssid} password ${JSON.parse(hlConfig).ssidPass}`;
    try{
      exec( cmdConnWifi, { "encoding":"utf8" });
    }catch( error ){
      console.log( error )
    };
  };
};

const saveBlockFrostApi = async ( ) => {
  const hlConfig:any = fs.readFileSync('/boot/firmware/hlConfig.json', 'utf8');
  console.log(JSON.parse(hlConfig));
  if( JSON.parse(hlConfig).blockfrostAPI !== "" ){
    console.log("Setting Blockfrost Api key: " +  JSON.parse(hlConfig).blockfrostAPI);
    
    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });

    console.log("writing Config");
    const SQLSaveConfig = `UPDATE Config SET blockfrostApiKey=? WHERE id=1`;
    try{
      const SQLSaveConfigRes: any = await db.run( SQLSaveConfig,  JSON.parse(hlConfig).blockfrostAPI );
      db.close();
      console.log( SQLSaveConfigRes );
    }catch( error ){
      console.log(error);
      db.close();
    };
  };
};

initDevice();

export default initDevice;
