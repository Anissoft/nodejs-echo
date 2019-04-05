/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as http from 'http';
import * as https from 'https';
import WebSocket from 'ws';

import generateId from './generateId';
import convertJSON from './convertJSON';
import { Request } from '../../types'

const createSniffer = (original: typeof http.request, effect: (req: Request) => void) => {
  function request(
    options: http.RequestOptions | string | URL,
    callback?: (res: http.IncomingMessage) => void,
  ): http.ClientRequest;
  function request(
    url: string | URL,
    options: http.RequestOptions,
    callback?: (res: http.IncomingMessage) => void,
  ): http.ClientRequest;
  function request(arg0: any, arg1?: any, arg2?: any): http.ClientRequest {
    try {
      let url: string | URL | undefined;
      let options: Request['options'];
      let callback: (res: http.IncomingMessage) => void;

      if (typeof arg0 === 'string' || arg0 instanceof URL) {
        url = arg0;
        options = arg1;
        callback = arg2;
      } else {
        options = arg0;
        callback = arg1;
      }
      effect({ id: generateId(), type: 'outgoing', status: 'pending', url, options });
    } catch (e) {
      console.log(e);
    }
    return original(arg0, arg1, arg2);
  }
  return request;
};

const prepare = (HTTP: typeof http, HTTPS: typeof https) => ({
  port,
  passphrase,
  debug = false,
}: {
  port: string | number;
  passphrase?: string;
  debug?: boolean;
}) => {
  console.log(
    `initiate Echo with port: ${port}, and passphrase: ${passphrase && passphrase.replace(/./g, '*')}`,
  );

  const originalHttp = HTTP.request;
  const originalHttps = HTTPS.request;
  const outgoing = new WebSocket.Server({ port: +port });

  outgoing.on('connection', ws => {
    if (debug) console.log('ws connection');
    const snifferHttp = createSniffer(originalHttp, req => {
      if (debug) console.log('ws send');
      ws.send(convertJSON(req), err => {
        if (err) {
          console.log(err);
          HTTP.request = originalHttp;
          ws.terminate();
        }
      });
    });
    const snifferHttps = createSniffer(originalHttps, req => {
      if (debug) console.log('ws send');
      ws.send(convertJSON(req), err => {
        if (err) {
          console.log(err);
          HTTPS.request = originalHttps;
          ws.terminate();
        }
      });
    });
    ws.on('message', message => {
      if (message === passphrase) {
        if (debug) console.log('ws auth true');
        ws.send('establish connection');
        HTTP.request = snifferHttp;
        HTTPS.request = snifferHttps;
      } else {
        if (debug) console.log('ws auth false');
        ws.send('incorrect passphrase', () => {
          HTTP.request = originalHttp;
          HTTPS.request = originalHttps;
          ws.terminate();
        });
      }
    });
  });
  return outgoing;
};

export default prepare(http, https);
