/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as http from 'http';
import * as https from 'https';
import WebSocket from 'ws';

import generateId from './generateId';
import convertJSON from './convertJSON';
import { Request, Response } from '../../types'
import { inspect } from 'util';

const createSniffer = (original: typeof http.request, effect: (arg0: Request | Response) => void) => {
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
    let url: string | URL | undefined;
    let options: Request['request'];
    let callback: (res: http.IncomingMessage) => void;

    try {
      if (!arg1 || typeof arg1 === 'function') {
        url = arg0;
        options = arg0;
        callback = arg1;
      } else {
        url = arg0;
        options = arg1;
        callback = arg2;
      }

      const id = generateId();

      effect({ id, type: 'outgoing', url, request: options });

      return original(options, (res) => {
        const { httpVersion, headers, method, url, statusCode, statusMessage } = res;

        const buffers: Array<Buffer> = []
        const strings: string[] = []
        let bufferLength = 0
        let data: string = ''

        res.on('data', (chunk) => {
          if (!Buffer.isBuffer(chunk)) {
            strings.push(chunk)
          } else if (chunk.length) {
            bufferLength += chunk.length
            buffers.push(chunk)
          }
        })

        res.on('end', () => {
          if (bufferLength) {
            data = Buffer.concat(buffers, bufferLength).toString('utf8')
          } else if (strings.length) {
            if (strings[0].length > 0 && strings[0][0] === '\uFEFF') {
              strings[0] = strings[0].substring(1)
            }
            data = strings.join('')
          }

          effect({
            id,
            response: {
              httpVersion,
              headers: headers as { [key: string]: string[] },
              method,
              url,
              statusCode,
              statusMessage,
              data,
            }
          });
        })

        callback && callback(res);
      });
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
  const schemas = {
    httpRequest: {
      original: HTTP.request,
      cleanup: (original: typeof http.request) => { HTTP.request = original; }
    },
    httpGet: {
      original: HTTP.get,
      cleanup: (original: typeof http.request) => { HTTP.get = original; }
    },
    httpsRequest: {
      original: HTTPS.request,
      cleanup: (original: typeof http.request) => { HTTPS.request = original; }
    },
    httpsGet: {
      original: HTTPS.get,
      cleanup: (original: typeof http.request) => { HTTP.get = original; }
    }
  };
  const prepareSniffer = ({
    original,
    cleanup,
  }: typeof schemas['httpRequest']) => createSniffer(original, req => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(convertJSON(req), err => {
          if (err) {
            console.log(err);
            cleanup(original);
            client.terminate();
          }
        });;
      }
    });
  })

  const wss = new WebSocket.Server({ port: +port });
  wss.on('connection', ws => {
    if (debug) console.log('ws connection');

    const sniffers = Object.entries(schemas)
      .reduce((acc, [key, schema]) => {
        return Object.assign(acc, {
          [key]: prepareSniffer(schema),
        })
      }, {} as any);

    ws.on('message', message => {
      if (message === passphrase) {
        if (debug) console.log('ws auth true');
        ws.send('establish connection');
        HTTP.request = sniffers.httpRequest;
        HTTP.get = sniffers.httpGet;
        HTTPS.request = sniffers.httpsRequest;
        HTTPS.get = sniffers.httpsGEt;
      } else {
        if (debug) console.log('ws auth false');
        ws.send('incorrect passphrase', () => {
          HTTP.request = schemas.httpRequest.original;
          HTTP.get = schemas.httpGet.original;
          HTTPS.request = schemas.httpsRequest.original;
          HTTPS.get = schemas.httpsGet.original;
          ws.terminate();
        });
      }
    });
  });
  return wss;
};

export default prepare(http, https);
