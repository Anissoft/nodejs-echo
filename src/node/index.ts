/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as http from 'http';
import * as https from 'https';
import * as WebSocket from 'ws';
import * as chalk from 'chalk';
import { resolve } from 'path';
import { createServer } from 'http-server';

import convertJSON from '../common/convertJSON';
import applySniffer from './sniffer/applySniffer';
import { RequestBody } from '../types';

const prepare = (HTTP: typeof http, HTTPS: typeof https) => {
  let enabled = false;
  const listeners: ((info: Request | Response | RequestBody) => void)[] = [];
  const sniffer = (info: Request | Response | RequestBody) => {
    if (!enabled) return;
    listeners.forEach(listener => listener(info));
  };

  HTTP.request = applySniffer(http.request, sniffer as any, false);
  HTTPS.request = applySniffer(https.request, sniffer as any, false);
  HTTP.get = applySniffer(http.get, sniffer as any, false);
  HTTPS.get = applySniffer(https.get, sniffer as any, false);

  return ({
    port,
    secret,
    debug = false,
  }: {
    port: string | number;
    secret: string;
    debug?: boolean;
  }) => {
    console.log(
      chalk.greenBright(`initiate Echo UI on port: ${port}, and websocket on port: ${+port + 1}`),
    );

    const wss = new WebSocket.Server({ port: +port + 1 });
    listeners.push(info => {
      if (debug) {
        console.log('call ws listener');
      }
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
      if (debug) console.log('ws connection');

      ws.on('message', message => {
        if (debug) {
          console.log('ws got message', message);
        }
        if (message === secret) {
          if (debug) {
            console.log('ws auth true');
          }
          ws.send('{"auth": true}');
          enabled = true;
        } else {
          if (debug) {
            console.log('ws auth false');
          }
          ws.send('{"auth": false}', () => {
            enabled = false;
            // ws.terminate();
          });
        }

        ws.on('close', () => {
          enabled = false;
        });
      });
    });

    const server = createServer({ root: resolve(__dirname, '..') });
    server.listen(port);

    return wss;
  };
};

export const start = prepare(http, https);

export default start;
