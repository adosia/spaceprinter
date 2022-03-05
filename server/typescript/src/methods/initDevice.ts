import { InitDevice } from "../generated-typings";
const { exec } = require('child_process');
import { getConfig } from "../utils/config";

const initDevice: InitDevice = async () => {
  const config: any = await getConfig();
  const network: string = config.network;
  const autoStartNode: boolean = config.autoStartNode;

  autoStartNode == true && await startCardanoNode( network );
  startSlicer();
  // await startCardanoWallet( network );
  return("ok");
};

const startCardanoWallet = async ( network: string ) => {
  console.log(`Starting Cardano Wallet on: ${network}`);
  const cmdWalletMainnet: string = `sudo systemctl start cwalletmain.service`;
  const cmdWalletTestnet: string = `sudo systemctl start cwallettest.service`;
  try{
    network == "testnet" ? exec( cmdWalletTestnet, { "encoding":"utf8" } ) : exec( cmdWalletMainnet, { "encoding":"utf8" } );
  }catch( error ){
    console.log( error );
    return( error );
  };
};

const startCardanoNode = async( network: string ) => {
  console.log(`Starting Cardano Node on: ${network}`);
  const cmdStartMainnet: string = "sudo systemctl start cnodemain.service";
  const cmdStartTestnet: string = "sudo systemctl start cnodetest.service";
  try{
    network == "testnet" ? exec( cmdStartTestnet, { "encoding":"utf8" } ) : exec( cmdStartMainnet, { "encoding":"utf8" } );
  }catch( error ){
    console.log( error )
    return( error );
  };
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
