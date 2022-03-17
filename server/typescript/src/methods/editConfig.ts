import { EditConfig } from "../generated-typings";
import { checkJWT } from "../utils/checkauth";
import { getConfig } from "../utils/config";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const editConfig: EditConfig = (jwToken, userName, sessionType, configjson) => {
  return new Promise( async(resolve, reject) =>{
    const checkToken: any = await checkJWT(jwToken, userName, sessionType);
    if( checkToken.name ) return resolve("authError");

    if(configjson === ""){
      resolve( getConfig() );
    }else{
      // open the database
      const db = await open({
        filename: './db/cb.db',
        driver: sqlite3.Database
      });
      console.log("writing Config");
      const conf: any = JSON.parse(configjson);
      const SQLSaveConfig = `UPDATE Config SET rootDir=?, serial=?, baud=?, network=?, testNetMagic=?, autoStartNode=? WHERE id=1`;
      try{
        const SQLSaveConfigRes: any = await db.run( SQLSaveConfig, conf.rootDir, conf.serial, conf.baud, conf.network, conf.testNetMagic, conf.autoStartNode );
        db.close();
        resolve(configjson);
      }catch( error ){
        console.log(error);
        db.close();
        return(error);
      }

    };
  });
};

export default editConfig;
