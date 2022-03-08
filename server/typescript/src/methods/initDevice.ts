import { InitDevice } from "../generated-typings";
const { exec } = require('child_process');
import { getConfig } from "../utils/config";

const initDevice: InitDevice = async () => {
  const config: any = await getConfig();
  const network: string = config.network;
  const autoStartNode: boolean = config.autoStartNode;

  autoStartNode == true && await startSlicer();;
  
  // await startCardanoWallet( network );
  return("ok");
};
const startSlicer = async(  ) => {
  console.log(`Starting gs server for slicer`);
  const cmdStartSlicer: string = "sudo systemctl start grid-apps.service";
  try{
    exec( cmdStartSlicer, { "encoding":"utf8" } );
  }catch( error ){
    console.log( error )
    return( error );
  };
};

initDevice();

export default initDevice;
