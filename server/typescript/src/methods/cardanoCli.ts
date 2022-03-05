import { CardanoCli } from "../generated-typings";
const  execAwait  = require('child_process').execSync;
import fs from 'fs';
import { getConfig } from "../utils/config";
import { checkJWT } from "../utils/checkauth";

const cardanoCli: CardanoCli = ( jwToken, cardanoCliCmd ) => {
    return new Promise( async ( resolve, reject ) => {
      const checkToken: any = await checkJWT(jwToken);
      if( checkToken.name ) return resolve("authError");
    
      const config: any = await getConfig();
      const network: string = config.network;
      const testnetMagic: string = config.testNetMagic
      const socketPath: string = config.network == "testnet" ? "/home/box/.cardanobox/app/cnode/testnet/socket/tnode.socket" : "/home/box/.cardanobox/app/cnode/mainnet/socket/mnode.socket"
      
      const result: any = sendCMD( cardanoCliCmd, network, testnetMagic, socketPath );
      resolve(result);
    });

};

const sendCMD = async( cmd: string, network: string, testnetMagic: string, socketPath: string ) => {
  const cardanoCLICmd: string = `/home/box/.cardanobox/app/cnode/bin/cardano-cli ${cmd} ${network == "testnet" ? testnetMagic : "--mainnet"}`
  console.log(cardanoCLICmd);
  try{
    const cmdResult: any = await execAwait( cardanoCLICmd, { "encoding": "utf8", "env": { "CARDANO_NODE_SOCKET_PATH": socketPath } } );
    console.log(cmdResult);

    const stdout: any = fs.readFileSync("./stdout.json", { encoding:'utf8', flag:'r' });
    console.log(stdout);
    
    return(stdout);
  }catch(error){
    console.log(error);
    return{error};
  };
};

export default cardanoCli;
