const { exec } = require('child_process');
import { getConfig } from "../utils/config";
import fs from 'fs';

const initDevice: any = async () => {
  const config: any = await getConfig();
  const network: string = config.network;
  const autoStartNode: boolean = config.autoStartNode;
  autoStartNode == true && await startSlicer();
  connectWiFi();
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
  const wifiInfo:any = fs.readFileSync('/boot/firmware/wifi.json', 'utf8');
  console.log(JSON.parse(wifiInfo));
  if(JSON.parse(wifiInfo).enabled == 1){
    console.log("Connecting to WiFi: " + wifiInfo.ssid);
    const cmdConnWifi: string = `sudo nmcli dev wifi connect ${wifiInfo.ssid} password ${wifiInfo.ssidPass}`;
    try{
      exec( cmdConnWifi, { "encoding":"utf8" });
    }catch( error ){
      console.log( error )
    };
  };
};

initDevice();

export default initDevice;
