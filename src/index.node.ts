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
import { NetworkEvent, NetworkEventType, RequestItem } from './types';

const emitter = new EventEmitter();
const buffer: Record<string, RequestItem> = { };
const captureEvent = (event: NetworkEvent) => {
  emitter.emit('message', event);

  if (event.type === NetworkEventType.Request) {
    buffer[event.id] = event;
  } else {
    Object.assign(buffer[event.id], event);
  }

  if (event.type === NetworkEventType.RequestData) {
    emitter.emit(buffer[event.id].incoming ? 'incoming-start' : 'outgoing-start', buffer[event.id]);
  }

  if (event.type === NetworkEventType.ResponseData) {
    emitter.emit(buffer[event.id].incoming ? 'incoming-end' : 'outgoing-end', buffer[event.id]);
    delete buffer[event.id];
  }
};

interceptServer(captureEvent);
interceptIncomingMessage(captureEvent);
interceptServerResponse(captureEvent);
interceptClientRequest(captureEvent);

export function subscribe(
  eventName: 'incoming-start' | 'incoming-end' | 'outgoing-start' | 'outgoing-end', 
  cb: (m: any) => void,
) {
  emitter.on(eventName, cb);

  return () => {
    emitter.off(eventName, cb);
  }
}

export async function startUI(opts?: number | { port?: number }) {
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
}

export const start = startUI;
