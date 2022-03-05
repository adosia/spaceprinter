import { CardanoWallet } from "../generated-typings";
import { curly  } from 'node-libcurl';
import { checkJWT } from "../utils/checkauth";

const cardanoWallet: CardanoWallet = ( jwToken, endPointType, endpoint, endpointData ) => {
  return new Promise(async (resolve,reject) =>{
    const checkToken: any = await checkJWT(jwToken);
    if( checkToken.name ) return resolve("authError");
    
    if(endPointType == "post"){
      const result: any = Post( endpoint, endpointData);
      return resolve( result );
    }else if( endPointType === "get" ){
      const result: any = Get( endpoint );
      return resolve( result );
    }else if( endPointType === "del"){
      const result: any = Del( endpoint );
      return resolve( result );
    };
  }); 
};

const Post = async ( endpoint: string, endpointData: any ) => {
  const { data } = await curly.post(`http://localhost:8090/v2/${endpoint}`, {
    postFields: JSON.stringify(endpointData),
    httpHeader: [
      'Content-Type: application/json',
      'Accept: application/json',
    ],
    SSL_VERIFYHOST: false,
    SSL_VERIFYPEER: false,
  });
  return(data);
};

const Get = async (endpoint: string ) => {
  const { data } = await curly.get(`http://localhost:8090/v2/${endpoint}`, {
    httpHeader: [
      'Content-Type: application/json',
      'Accept: application/json',
    ],
    SSL_VERIFYHOST: false,
    SSL_VERIFYPEER: false,
  });
  return(data);
};

const Del = async (endpoint: string ) => {
  const { data } = await curly.delete(`http://localhost:8090/v2/${endpoint}`, {
    httpHeader: [
      'Content-Type: application/json',
      'Accept: application/json',
    ],
    SSL_VERIFYHOST: false,
    SSL_VERIFYPEER: false,
  });
  return(data);
};

export default cardanoWallet;
