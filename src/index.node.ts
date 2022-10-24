import { EventEmitter } from 'events';
import { interceptClientRequest } from './interceptors/clientRequest';

import { interceptIncomingMessage } from './interceptors/incomingMessage';
import { interceptServer } from './interceptors/server';
import { interceptServerResponse } from './interceptors/serverResponse';
import { createWebSocketServer } from './servers/ws';
import { NetworkEvent } from './types';
import { stringifySafe } from './utils/json';

export function start({ port }: {port: number | string}) {
  const emitter = new EventEmitter();
  const captureEvent = (event: NetworkEvent) => {
    console.log(`[{${event.type}}]`, event)
    emitter.emit('message', event);
  }
  
  interceptServer(captureEvent);
  interceptIncomingMessage(captureEvent);
  interceptServerResponse(captureEvent);
  interceptClientRequest(captureEvent);

  createWebSocketServer()
    .then(wss => {
      wss.on('connection', ws => {
        emitter.on('message', (message: NetworkEvent) => {
          ws.send(stringifySafe(message));
        });
      });
    });
}