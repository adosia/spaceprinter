import spaceprinterclient from "spaceprinterclient";
import cardanoboxclient from "cardanoboxclient";
var W3CWebSocket = require('websocket').w3cwebsocket;

export const SpacePrinterHttp = new spaceprinterclient({
    transport: {
        type: "http",
        host: window.location.hostname == "armdev" ? "spaceprinter.local" : window.location.hostname,
        port: 4441,
    },
});

export const SpacePrinterWS = new spaceprinterclient({
    transport: {
        type: "websocket",
        host: window.location.hostname == "armdev" ? "spaceprinter.local" : window.location.hostname,
        port: 3331,
    },
});

export const SpacePrinterWSSend = new W3CWebSocket(
  window.location.hostname == "armdev" ? 'ws://spaceprinter.local:3331/' : `ws://${window.location.hostname}:3331/`, 'echo-protocol'
);

export const OgmiosWS = new W3CWebSocket(
   'ws://cardanobox.local:4200'
);

OgmiosWS.onopen = () => {
  console.log("Ogmios connection open")
};

OgmiosWS.onerror = function() {
  console.log('Ogmios Connection Error');
};

export const wsp = (methodname: any, args: any) => {
  OgmiosWS.send(JSON.stringify({
    type: "jsonwsp/request",
    version: "1.0",
    servicename: "ogmios",
    methodname,
    args
  }));
}

export const CardanoBoxHttp = new cardanoboxclient({
    transport: {
        type: "http",
        host: "cardanobox.local",
        port: 4441,
    },
});

export const blockfrostApi = async ( uri: string, method: string, content: any ) => {
  console.log(JSON.stringify(content));
  let settings:any = {};
  const blockfrostApi: any = localStorage.getItem("blockfrostApi"); 

  let tx = Buffer.from(content, 'hex');

  method == "POST" ?
    settings = {
      method: method,
      body: tx,
      headers: {
        "project_id": blockfrostApi,
        "Content-Type": "application/cbor",
      }
    }
    :
    settings = {
      method: method,
      headers: {
        "project_id": blockfrostApi,
      }
    };

  try {
    const fetchResponse: any = await fetch(uri, settings);
    const data: any = await fetchResponse.json();
    // console.log(data);
    return(data);
  } catch (e) {
    console.log(e);
    return e;
  }; 
};

