import { Server, ServerOptions } from "@open-rpc/server-js";
import { HTTPServerTransportOptions } from "@open-rpc/server-js/build/transports/http";
import { HTTPSServerTransportOptions } from "@open-rpc/server-js/build/transports/https";
import { WebSocketServerTransportOptions } from "@open-rpc/server-js/build/transports/websocket";
import { OpenrpcDocument } from "@open-rpc/meta-schema";
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import methodMapping from "./generated-method-mapping";
import doc from "./openrpc.json";
let serialport = require('serialport');
const exec = require('child_process').exec
import fs from 'fs';

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
        type: "HTTPSTransport",
        options: {
          port: process.env.HTTPS_PORT || 4442,
          middleware: [],
          key: fs.readFileSync("cert/server.key"),
          cert: fs.readFileSync("cert/server.cert"),
          // ca: fs.readFileSync("ssl/ca.crt")
        } as HTTPSServerTransportOptions,
      }
    ],
    methodMapping,
  };

  console.log("Starting Server"); // tslint:disable-line
  const s = new Server(serverOptions);

  s.start();
  

}
