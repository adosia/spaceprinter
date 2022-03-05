import { GetCBWallets } from "../generated-typings";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { checkJWT } from "../utils/checkauth";

const getCBWallets: GetCBWallets = ( jwToken, walletID) => {
  return new Promise( async( resolve, reject ) => {
    const checkToken: any = await checkJWT(jwToken);
    if( checkToken.name ) return resolve("authError");
    
    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });

    if( walletID == "" ) resolve(queryAllWallets( db ));
    if( walletID != "" ) resolve(queryWalletAccounts( db, walletID ));
  });
};

const queryAllWallets = async ( db: any ) => {
  try{
    const SQL: string = 'SELECT walletID, walletName, walletType, timeCreated FROM Wallets';
    const resultWallets: any = await db.all(SQL);
    console.log( resultWallets );
    db.close();
    return( resultWallets );
  }catch( error ){
    console.log(error);
    return( error );
  };
};

const queryWalletAccounts = async ( db: any, walletID: string ) => {
  try{
    const SQL: string = 'SELECT * FROM WalletAccounts WHERE walletID = ?';
    const walletAccountsRes: any = await db.all( SQL, [ walletID ] );
    console.log( walletAccountsRes );
    db.close();
    return( walletAccountsRes );
  }catch( error ){
    console.log(error);
    return( error );
  };
};

export default getCBWallets;
