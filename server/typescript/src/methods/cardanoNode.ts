import { CardanoNode } from "../generated-typings";
const execAwait = require('child_process').execSync;
const exec = require('child_process').exec;
import { getConfig } from "../utils/config";
import { checkJWT } from "../utils/checkauth";

const cardanoNode: CardanoNode = ( jwToken, nodeAction, nodeNetwork) => {
  return new Promise( async( resolve, reject ) => {
    const checkToken: any = await checkJWT(jwToken);
    if( checkToken.name ) return resolve("authError");
    
    const config: any = await getConfig();
    const network: string = config.network;
    
    nodeAction === "start" ? resolve(startNode( network )) : nodeAction === "stop" && resolve(stopNode( network ));
    nodeAction === "" && resolve( queryEKG() );
  });
};

const startNode = async( network: string ) => {
  console.log(`Starting Cardano Node on: ${network}`);
  const cmdStartMainnet: string = "sudo systemctl start cnodemain.service";
  const cmdStartTestnet: string = "sudo systemctl start cnodetest.service";
  try{
    network == "testnet" ? execAwait( cmdStartTestnet, { "encoding":"utf8" } ) : execAwait( cmdStartMainnet, { "encoding":"utf8" } );
    return('ok');
  }catch( error ){
    console.log( error )
    return( error );
  };
};

const stopNode = async( network: string ) => {
  console.log(`Starting Cardano Node on: ${network}`);
  const cmdStartMainnet: string = "sudo systemctl stop cnodemain.service";
  const cmdStartTestnet: string = "sudo systemctl stop cnodetest.service";
  try{
    network == "testnet" ? execAwait( cmdStartTestnet, { "encoding":"utf8" } ) : execAwait( cmdStartMainnet, { "encoding":"utf8" } );
    return('ok');
  }catch( error ){
    console.log( error )
    return( error );
  };
};

const queryEKG = async () => {
  const command: string = "curl -s -f -H 'Accept: application/json' http://localhost:12788";
  try{
    const ekgRes: any = await execAwait( command , { "encoding":"utf8" } );
    return(ekgRes);
  }catch( error ){
    console.log( error );
    return( error );
  }
};

export default cardanoNode;
