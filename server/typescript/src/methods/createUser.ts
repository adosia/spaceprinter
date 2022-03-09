import { CreateUser } from "../generated-typings";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from "bcrypt";

const createUser: CreateUser = async ( userName, password, accountType ) => {
  if(userName == "") return({"error": "blank"});
  if(password == "") return({"error": "blank"});
  
  const newUserRes: any = await newUser( userName, password, accountType );
  return(newUserRes);
};

const newUser = async ( userName: string, password: string, accountType: string ) => {
  const db: any = await open({
    filename: './db/cb.db',
    driver: sqlite3.Database
  });
  const passEncrypt: any = await bcrypt.hash( password, 10 );
  const timecreated: any  = Math.floor(Date.now() / 1000);
  const insertUserSQL: string = `INSERT INTO Account ( userName, password, accountType, timeCreated ) VALUES (?, ?, ?, ?)`;
  const getUserSQL: string = 'SELECT accountName FROM Account';
  try{
    const checkAccountRes: any = await db.get(getUserSQL);
    // console.log(typeof checkAccountRes);
    
    if(typeof checkAccountRes !== "undefined") db.close();
    if(typeof checkAccountRes !== "undefined") return({"error":"Account Exists"});

    const queryDB: any = await db.run( insertUserSQL, [ userName, passEncrypt, accountType, timecreated ] );
    db.close();
    return(queryDB);
  }catch( error ) {
    console.log(error);
    return(error);
  };
};

export default createUser;
