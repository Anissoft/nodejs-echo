/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as http from 'http';
import * as https from 'https';
import * as WebSocket from 'ws';
import * as chalk from 'chalk';

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

  HTTP.request = applyRequestSniffer(http.request, sniffer, false);
  HTTPS.request = applyRequestSniffer(https.request, sniffer, false);
  HTTP.get = applyRequestSniffer(http.get, sniffer, false);
  HTTPS.get = applyRequestSniffer(https.get, sniffer, false);

  const createHTTPServer = applyServerSniffer(http, sniffer, false);
  const createHTTPSServer = applyServerSniffer(https, sniffer, false);

  HTTP.createServer = createHTTPServer;
  HTTPS.createServer = createHTTPSServer;

  return ({
    port = process.env.NODEJS_ECHO_PORT || '4901',
    secret = '',
    debug = false,
  }: {
    port: string | number;
    secret: string;
    debug?: boolean;
  }) => {
    const wss = new WebSocket.Server({ port: +port });
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
          });
        }

        ws.on('close', () => {
          enabled = false;
        });
      });
    });

    console.log(chalk.greenBright(`Echo started to broadcast on ws://localhost:${port}`));
    return wss;
  };
};

export const start = prepare(http, https);

export default start;
