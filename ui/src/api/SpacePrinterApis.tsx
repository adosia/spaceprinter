import spaceprinterclient from "spaceprinterclient";
import cardanoboxclient from "cardanoboxclient";
const W3CWebSocket = require('websocket').w3cwebsocket;

export const SpacePrinterAPI = new spaceprinterclient({
    transport: {
        type: window.location.hostname == "armdev" ? "http" : "https",
        host: window.location.hostname == "armdev" ? "spaceprinter.local" : window.location.hostname,
        port: window.location.hostname == "armdev" ? 4441 : 4442
    },
});

// Create Websocket for space printer
export const SpacePrinterWSS = new W3CWebSocket(
  window.location.hostname == "armdev" ? 
    'ws://spaceprinter.local:3331/' : 
    `wss://${window.location.hostname}:3332/`, 'echo-protocol'
);

SpacePrinterWSS.onopen = () => {
  console.log("Space Printer connection open")
};

SpacePrinterWSS.onerror = () => {
  console.log('Space Printer Connection Error');
};

// Create websocket for Ogmios on Cardano Box
export const OgmiosWS = new W3CWebSocket(
  window.location.hostname == "armdev" ? 
  'ws://cardanobox.local:4200' : 
  'wss://cardanobox.local:4200'
);

OgmiosWS.onopen = () => {
  console.log("Ogmios connection open")
};

OgmiosWS.onerror = () => {
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

