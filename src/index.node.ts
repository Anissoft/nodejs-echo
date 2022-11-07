import * as chalk from 'chalk';
import { EventEmitter } from 'events';

import { interceptServer } from './interceptors/server';
import { interceptClientRequest } from './interceptors/clientRequest';
import { interceptIncomingMessage } from './interceptors/incomingMessage';
import { interceptServerResponse } from './interceptors/serverResponse';

import { createWebSocketServer } from './servers/ws';
import { startHTTPServer } from './servers/http';
import { stringifySafe } from './utils/json';
import { getFreePort } from './utils/net';
import { NetworkEvent } from './types';

export function start(opts?: number | { port?: number }) {
  const emitter = new EventEmitter();
  const captureEvent = (event: NetworkEvent) => {
    emitter.emit('message', event);
  };

  interceptServer(captureEvent);
  interceptIncomingMessage(captureEvent);
  interceptServerResponse(captureEvent);
  interceptClientRequest(captureEvent);

  /* eslint-disable @typescript-eslint/no-floating-promises */
  (async () => {
    const httpPort = (typeof opts === 'object' ? opts.port : opts) ?? (await getFreePort());
    const wssPort = await getFreePort(httpPort);
    const wss = await createWebSocketServer(wssPort);
    console.log(
      chalk.yellowBright(`http-debug started to broadcast events on ws://localhost:${wssPort}`),
    );
    await startHTTPServer(httpPort);
    console.log(
      chalk.greenBright(`http-debug has started on http://localhost:${httpPort}?socket=${wssPort}`),
    );

    emitter.on('message', (message: NetworkEvent) => {
      wss.clients.forEach((client) => {
        if (client.readyState !== client.OPEN) {
          return;
        }
        client.send(stringifySafe(message), (err) => {
          if (err != null) {
            console.log(err);
          }
        });
      });
    });
  })();
}
