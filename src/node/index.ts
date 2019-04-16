/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { inherits } from 'util';
import * as http from 'http';
import * as https from 'https';
import WebSocket from 'ws';
import { createServer } from 'http-server';

import convertJSON from '../common/convertJSON';
import createSniffer from './sniffer/createSniffer'

const prepare = (HTTP: typeof http, HTTPS: typeof https) => ({
  port,
  debug = false,
}: {
  port: string | number;
  debug?: boolean;
}) => {
  console.log(
    `initiate Echo UI on port: ${port}, and websocket on port: ${+port + 1}`,
  );

  const schemas = {
    httpRequest: {
      original: HTTP.request,
      cleanup: (original: typeof http.request) => { HTTP.request = original; }
    },
    httpGet: {
      original: HTTP.get,
      cleanup: (original: typeof http.get) => { HTTP.get = original; }
    },
    httpsRequest: {
      original: HTTPS.request,
      cleanup: (original: typeof https.request) => { HTTPS.request = original; }
    },
    httpsGet: {
      original: HTTPS.get,
      cleanup: (original: typeof https.get) => { HTTPS.get = original; }
    }
  };

  const wss = new WebSocket.Server({ port: +port + 1 });

  const prepareSniffer = ({
    original,
    cleanup,
  }: typeof schemas['httpRequest']) => createSniffer(original, req => {
    if (debug) console.log('ws uses effect with', req);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(convertJSON(req), err => {
          if (err) {
            console.log(err);
            // cleanup(original);
            // client.terminate();
          }
        });;
      }
    });
  })
  const cleanAll = () => Object.values(schemas).forEach(({ original, cleanup }) => { cleanup(original) });

  type Sniffers = { [key in 'httpRequest' | 'httpGet' | 'httpsRequest' | 'httpsGet']: typeof http['request'] }
  const sniffers: Sniffers = Object.entries(schemas)
    .reduce((acc, [key, schema]) => {
      return Object.assign(acc, {
        [key]: prepareSniffer(schema),
      })
    }, {} as any);

  wss.on('connection', ws => {
    if (debug) console.log('ws connection');

    ws.on('message', message => {
      if (message === '69742773206D65202D204D6172696F21') {
        if (debug) console.log('ws auth true');
        ws.send('establish connection');
        HTTP.request = sniffers.httpRequest;
        HTTP.get = sniffers.httpGet;
        HTTPS.request = sniffers.httpsRequest;
        HTTPS.get = sniffers.httpsGet;
      } else {
        if (debug) console.log('ws auth false');
        ws.send('incorrect passphrase', () => {
          cleanAll();
          ws.terminate();
        });
      }

      ws.on('close', cleanAll);
    });
  });

  const server = createServer({ root: __dirname });
  server.listen(port);

  return wss;
};

export default prepare(http, https);
