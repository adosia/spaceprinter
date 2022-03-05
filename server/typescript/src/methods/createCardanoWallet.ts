import { CreateCardanoWallet } from "../generated-typings";
import cardanoWallet from "./cardanoWallet";
const exec = require('child_process').execSync;
import { checkJWT } from "../utils/checkauth";

const createCardanoWallet: CreateCardanoWallet = (jwToken, walletName, seedPhrase, walletPassPhrase, xpubKey) => {
  return new Promise( async ( resolve, reject ) => {
    const checkToken: any = await checkJWT( jwToken );
    if( checkToken.name ) return resolve("authError");

    const newWallet: any = await createWallet( jwToken, walletName, walletPassPhrase, xpubKey);
    console.log( newWallet );
    resolve( newWallet );
  });
};

const genSeedPhrase = async () => {
  const command: string = "cardano-wallet recovery-phrase generate";
  try{
    const genPhrase: any = await exec( command, { "encoding":"utf8" } );
    console.log( genPhrase );
    return( genPhrase );
  }catch( error ){
    console.error( error );
    return( error );
  };
};

const createWallet = async ( jwToken: string, walletName: string, walletPassPhrase: string, xpubKey: string ) => {
  const seed: string = await genSeedPhrase();
  const seedArray: any[] = seed.trim().split(" ");
  console.log( seedArray );
  const walletInfo: any  = {
    "name": walletName,
    "mnemonic_sentence":seedArray,
    "passphrase": walletPassPhrase,
    "address_pool_gap": 20
  };

  try{
    const result: any = await cardanoWallet( jwToken, "post", "wallets", walletInfo );
    return{
      result,
      seed
    };
  }catch( error ){
    console.error(error);
    return( error );
  }

};

export default createCardanoWallet;