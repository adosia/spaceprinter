import { Update } from "../generated-typings";
const exec = require('child_process').execSync;
import { checkJWT } from "../utils/checkauth";

const update: Update = ( jwToken, updateType ) => {
  return new Promise( async (resolve, reject) => {
    const checkToken: any = await checkJWT(jwToken);
    if( checkToken.name ) return resolve("authError");

    if (updateType === "full" ){
      const updateFullRes: any = getFull();
      return resolve(updateFullRes);
    }else if(updateType === "update"){
      const updateRes: any = getUpdate();
      return resolve(updateRes);
    }else if(updateType === "ui"){
      const updateUiRes: any = updateUI();
      return resolve(updateUiRes);
    }else{
      console.log(updateType);
      return resolve("error");
    };
  });
};

const getFull = async() => {
  let mirror;
  try{
    const mirror1: string = "curl https://link.us1.storjshare.io/s/jwsuf2mh3ke4ipt2cadpp64js6lq/spaceprinter/spaceprinterInstall.tgz?download=1 -o spaceprinterInstall.tgz  && mv spaceprinterInstall.tgz /home/printer/.spaceprinter/updates/";
    const mirror1res: any = await checkMirror("https://link.us1.storjshare.io/s/jwsuf2mh3ke4ipt2cadpp64js6lq/spaceprinter/spaceprinterInstall.tgz?download=1");
    // console.log(mirror1res)
    const mirror2: string = "curl -O https://spaceprinter.bakon.dev/app/spaceprinterInstall.tgz && mv spaceprinterInstall.tgz /home/printer/.spaceprinter/updates/";
    const mirror2res: any = await checkMirror("https://spaceprinter.bakon.dev/app/spaceprinterInstall.tgz");
    // console.log(mirror2res);
    mirror1res == "200"? mirror = mirror1 : mirror = mirror2;
    console.log( mirror );
    const command2: string = "rm -rf /home/printer/.spaceprinter/app/* && tar -xvzf /home/printer/.spaceprinter/updates/spaceprinterInstall.tgz -C /home/printer/.spaceprinter/app/";
    const command3: string = "sudo systemctl restart spaceprinter.service";
    console.log(await exec( mirror , { "encoding":"utf8" } ));
    console.log(await exec( command2 , { "encoding":"utf8" } ));
    console.log(setTimeout(()=>{ exec( command3, { "encoding":"utf8" }), 3000 }));
    return("ok");
  }catch(error){
    console.log(error);
    return("error");
  };
};

const getUpdate = async() => {
  let mirror;
  try{
    const mirror1: string = "curl https://link.us1.storjshare.io/s/jul3nrrwumstjejenvltb6xr2wxa/spaceprinter/spaceprinterUpdate.tgz?download=1 -o spaceprinterUpdate.tgz && mv spaceprinterUpdate.tgz /home/printer/.spaceprinter/updates/";
    const mirror1res: any = await checkMirror("https://link.us1.storjshare.io/s/jul3nrrwumstjejenvltb6xr2wxa/spaceprinter/spaceprinterUpdate.tgz?download=1");
    // console.log(mirror1res);
    const mirror2: string = "curl -O https://spaceprinter.bakon.dev/app/spaceprinterUpdate.tgz && mv spaceprinterUpdate.tgz /home/printer/.spaceprinter/updates/";
    const mirror2res: any = await checkMirror("https://spaceprinter.bakon.dev/app/spaceprinterUpdate.tgz");
    // console.log(mirror2res);
    mirror1res == "200"? mirror = mirror1 : mirror = mirror2;
    console.log( mirror );
    const command2: string = "rm /home/printer/.spaceprinter/app/spaceprinter && tar -xvzf /home/printer/.spaceprinter/updates/spaceprinterUpdate.tgz -C /home/printer/.spaceprinter/app/";
    const command3: string = "sudo systemctl restart spaceprinter.service";
    console.log(await exec( mirror , { "encoding":"utf8" } ));
    console.log(await exec( command2, { "encoding":"utf8" } ));
    console.log(setTimeout(()=>{ exec( command3, { "encoding":"utf8" }), 3000 }));
    return("ok");
  }catch(error){
    console.log(error);
    return("error");
  };
};

const updateUI = async() => {
  let mirror;
  try{
    const mirror1: string = "curl https://link.us1.storjshare.io/s/juyp4i5zlp2v6j4oaurn2jyrz4kq/spaceprinter/spaceprinterui.tgz?download=1 -o spaceprinterui.tgz && mv spaceprinterui.tgz /home/printer/.spaceprinter/updates/";
    const mirror1res: any = await checkMirror("https://link.us1.storjshare.io/s/juyp4i5zlp2v6j4oaurn2jyrz4kq/spaceprinter/spaceprinterui.tgz?download=1");
    // console.log(mirror1res);
    const mirror2: string = "curl -O https://spaceprinter.bakon.dev/app/spaceprinterui.tgz && mv spaceprinterui.tgz /home/printer/.spaceprinter/updates/";
    const mirror2res: any = await checkMirror("https://spaceprinter.bakon.dev/app/spaceprinterui.tgz");
    // console.log(mirror2res);
    mirror1res == "200"? mirror = mirror1 : mirror = mirror2;
    console.log( mirror );
    const command2: string = "rm -rf /home/printer/.spaceprinter/www/* && tar -xvzf /home/printer/.spaceprinter/updates/spaceprinterui.tgz -C /home/printer/.spaceprinter/www/";
    console.log(await exec( mirror , { "encoding":"utf8" } ));
    console.log(await exec( command2 , { "encoding":"utf8" } ));
    return("ok");
  }catch(error){
    console.log(error);
    return("error");
  };
};

const checkMirror = async( mirror: string ) => {
  try {
    const queryMirror: string = `curl -o /dev/null --silent -Iw '%{http_code}' ${mirror}`;
    const queryMirrorres: any = await exec( queryMirror , { "encoding":"utf8" } );
    // console.log(queryMirrorres);
    return(queryMirrorres);
  }catch(error){
    console.log( error )
    return(error);
  }
};

export default update;
