/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as http from 'http';
import * as https from 'https';
import * as WebSocket from 'ws';
import * as chalk from 'chalk';
import * as path from 'path';
import { createServer } from 'http-server';

import convertJSON from '../common/convertJSON';
import applyRequestSniffer from './sniffer/applyRequestSniffer';
import applyServerSniffer from './sniffer/applyServerSniffer';
import { RequestBody, Request, Response } from '../types';

const prepare = (HTTP: typeof http, HTTPS: typeof https) => {
  let enabled = false;
  const listeners: ((info: Request | Response | RequestBody) => void)[] = [];
  const sniffer = (info: Request | Response | RequestBody) => {
    if (!enabled) return;
    listeners.forEach(listener => listener(info));
  };

  HTTP.request = applyRequestSniffer(http.request, sniffer);
  HTTPS.request = applyRequestSniffer(https.request, sniffer);
  HTTP.get = applyRequestSniffer(http.get, sniffer);
  HTTPS.get = applyRequestSniffer(https.get, sniffer);

  const createHTTPServer = applyServerSniffer(http, sniffer);
  const createHTTPSServer = applyServerSniffer(https, sniffer);

  HTTP.createServer = createHTTPServer;
  HTTPS.createServer = createHTTPSServer;

  return ({
    port = +(process.env.NODEJS_ECHO_PORT || 4900) as number,
    secret = '',
    debug = false,
  }: {
    port: number;
    secret?: string;
    debug?: boolean;
  }) => {
    const wsPort = port + 1;
    const socket = encodeURIComponent(`ws://localhost:${wsPort}`);
    const server = createServer({ root: path.resolve(__dirname, '..') });

    server.listen(port, () => {
      console.log(chalk.greenBright(`NodeJS Echo UI started on http://localhost:${port}?socket=${socket}${secret ? `&secret=${secret}`: ''}`));
    });

    const wss = new WebSocket.Server({ port: wsPort });
    listeners.push(info => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(convertJSON(info), err => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
    wss.on('connection', ws => {
      ws.on('message', message => {
        if (message === secret) {
          ws.send('{"auth": true}');
          enabled = true;
        } else {
          ws.send('{"auth": false}', () => {
            enabled = false;
          });
        }

        ws.on('close', () => {
          enabled = false;
        });
      });
    });

    console.log(chalk.greenBright(`NodeJS Echo started to broadcast on ws://localhost:${wsPort}`));
    return wss;
  };
};

export const start = prepare(http, https);

export default start;
