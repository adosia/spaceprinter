import { GenGruntTX } from "../generated-typings";
import { checkJWT } from "../utils/checkauth";
import { gruntTX } from "../utils/txbuilder";
import { encrypt, decrypt } from "../utils/crypt";
import { genUTXOKey } from "../utils/wallet";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')

const genGruntTX: GenGruntTX = (jwToken, walletID, walletPass, addressName, utxos, assets, metadata, outputAddress, outputValue, changeAddress, txTTL) => {
  return new Promise( async (resolve, reject) => {
    const checkToken: any = await checkJWT(jwToken);
    if( checkToken.name ) return resolve("authError");

    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });

    const SQLgetKey: string = 'SELECT accountKeyPrv FROM WalletAccounts WHERE walletID = ?';
    try{
      const accKeyEncryped: any = await db.get( SQLgetKey, [ walletID ] );
      console.log(accKeyEncryped);
      const keyDecrepty: any = await decrypt( walletPass, accKeyEncryped.accountKeyPrv );
      const accountKey: any = CardanoWasm.Bip32PrivateKey.from_bech32(keyDecrepty);
      const utxoKey: any = await genUTXOKey( accountKey, 0 );
      console.log(utxos);
      console.log(assets);
      console.log(metadata);
      console.log(utxoKey)
      const gruntTxResult = await gruntTX( utxoKey, utxos, assets, metadata, outputAddress, outputValue, changeAddress, txTTL );
      resolve(gruntTxResult);
    }catch( error ){
      console.log(error);
      return(error);
    }

  });
};

export default genGruntTX;
