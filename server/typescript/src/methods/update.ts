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
    const mirror1: string = "curl https://link.us1.storjshare.io/s/jwg7i752jbvia76pxhjgboqcmnfa/cardanobox/cardanoboxInstall.tgz?download -o cardanoboxInstall.tgz  && mv cardanoboxInstall.tgz /home/box/.cardanobox/updates/";
    const mirror1res: any = await checkMirror("https://link.us1.storjshare.io/s/jwg7i752jbvia76pxhjgboqcmnfa/cardanobox/cardanoboxInstall.tgz?download");
    // console.log(mirror1res)
    const mirror2: string = "curl -O https://cardanobox.bakon.dev/app/cardanoboxInstall.tgz && mv cardanoboxInstall.tgz /home/box/.cardanobox/updates/";
    const mirror2res: any = await checkMirror("https://cardanobox.bakon.dev/app/cardanoboxInstall.tgz");
    // console.log(mirror2res);
    mirror1res == "200"? mirror = mirror1 : mirror = mirror2;
    console.log( mirror );
    const command2: string = "rm -rf /home/box/.cardanobox/app/* && tar -xvzf /home/box/.cardanobox/updates/cardanoboxInstall.tgz -C /home/box/.cardanobox/app/";
    const command3: string = "sudo systemctl restart cardanobox.service";
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
    const mirror1: string = "curl https://link.us1.storjshare.io/s/juzpqv53xv7ni3qthpdj2tzckacq/cardanobox/cardanoboxUpdate.tgz?download -o cardanoboxUpdate.tgz && mv cardanoboxUpdate.tgz /home/box/.cardanobox/updates/";
    const mirror1res: any = await checkMirror("https://link.us1.storjshare.io/s/juzpqv53xv7ni3qthpdj2tzckacq/cardanobox/cardanoboxUpdate.tgz?download");
    // console.log(mirror1res);
    const mirror2: string = "curl -O https://cardanobox.bakon.dev/app/cardanoboxUpdate.tgz && mv cardanoboxUpdate.tgz /home/box/.cardanobox/updates/";
    const mirror2res: any = await checkMirror("https://cardanobox.bakon.dev/app/cardanoboxUpdate.tgz");
    // console.log(mirror2res);
    mirror1res == "200"? mirror = mirror1 : mirror = mirror2;
    console.log( mirror );
    const command2: string = "rm /home/box/.cardanobox/app/cardanobox && tar -xvzf /home/box/.cardanobox/updates/cardanoboxUpdate.tgz -C /home/box/.cardanobox/app/";
    const command3: string = "sudo systemctl restart cardanobox.service";
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
    const mirror1: string = "curl https://link.us1.storjshare.io/s/jxkhlltdcbuvjpqoi6af2orvquxq/cardanobox/cardanoboxui.tgz?download -o cardanoboxui.tgz && mv cardanoboxui.tgz /home/box/.cardanobox/updates/";
    const mirror1res: any = await checkMirror("https://link.us1.storjshare.io/s/jxkhlltdcbuvjpqoi6af2orvquxq/cardanobox/cardanoboxui.tgz?download");
    // console.log(mirror1res);
    const mirror2: string = "curl -O https://cardanobox.bakon.dev/app/cardanoboxui.tgz && mv cardanoboxui.tgz /home/box/.cardanobox/updates/";
    const mirror2res: any = await checkMirror("https://cardanobox.bakon.dev/app/cardanoboxui.tgz");
    // console.log(mirror2res);
    mirror1res == "200"? mirror = mirror1 : mirror = mirror2;
    console.log( mirror );
    const command2: string = "rm -rf /home/box/.cardanobox/www/* && tar -xvzf /home/box/.cardanobox/updates/cardanoboxui.tgz -C /home/box/.cardanobox/www/";
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
