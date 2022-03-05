import { Server, ServerOptions } from "@open-rpc/server-js";
import { HTTPServerTransportOptions } from "@open-rpc/server-js/build/transports/http";
import { WebSocketServerTransportOptions } from "@open-rpc/server-js/build/transports/websocket";
import { OpenrpcDocument } from "@open-rpc/meta-schema";
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import methodMapping from "./generated-method-mapping";
import doc from "./openrpc.json";
let serialport = require('serialport');
const exec = require('child_process').exec

export async function start() {
  const serverOptions: ServerOptions = {
    openrpcDocument: await parseOpenRPCDocument(doc as OpenrpcDocument),
    transportConfigs: [
      {
        type: "HTTPTransport",
        options: {
          port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 4441,
          middleware: [],
        } as HTTPServerTransportOptions,
      },
      {
        type: "WebSocketTransport",
        options: {
          port: process.env.WS_PORT || 3331,
          middleware: [],
        } as WebSocketServerTransportOptions,
      },
    ],
    methodMapping,
  };

  console.log("Starting Server"); // tslint:disable-line
  const s = new Server(serverOptions);

  s.start();

  const wss = (s as any).transports[1].wss; //capture websocket from serverjs.
  let myPort = new serialport("/dev/ttyUSB0", { baudRate: 115200, autoOpen: false }); //capture serial port but don't start it.
  let Readline = serialport.parsers.Readline; // make instance of Readline parser.
  let parser = new Readline(); // make a new parser to read ASCII lines.
  myPort.pipe(parser); // pipe the serial stream to the parser.
  
  wss.on('connection',  async ( ws: any ) => {
    console.log("connected");
    ws.send(JSON.stringify({jsonrpc: '2.0', method: 'websocket', params: ["Websocket Connected"]}))

    myPort.on('open', ( ) => {
      console.log('port open. Data rate: ' + myPort.baudRate);
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', params: ['serial open. Data rate: ' + myPort.baudRate]}))
    });

    myPort.on('error', ( err: any ) => {
      console.log('Error: ', err.message)
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', params: [ err.message ]}))
    });

    parser.on('data', ( data: any ) => {
      console.log(data);
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', params: [data]}))
    });

    myPort.on('close', ( ) => {
      console.log('port closed.');
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', params: ["Port Connection Closed"]}));
    });

    ws.on('message', ( data: any ) => {
      let message = JSON.parse(data);
      console.log(message);
      message.method == "serialPort" && message.params[0] == "open" && myPort.open();
      message.method == "serialPort" && message.params[0] == "close" && myPort.close();
    });
  });
}
