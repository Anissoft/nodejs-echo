import { EventEmitter } from 'events';
import { AddressInfo } from 'ws';

import { interceptIncomingMessage } from './interceptors/incomingMessage';
import { interceptOutgoingMessage } from './interceptors/outgoingMessage';
import { interceptServer } from './interceptors/server';
import { interceptServerResponse } from './interceptors/serverResponse';
import { interceptSocketWrite } from './interceptors/socket';
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
  // interceptOutgoingMessage(captureEvent);
  // interceptSocketWrite(captureEvent);

  createWebSocketServer()
    .then(wss => {
      console.log(`[debug] wss started on ws://localhost:${(wss.address() as AddressInfo).port}`)
      wss.on('connection', ws => {
        emitter.on('message', (message: NetworkEvent) => {
          ws.send(stringifySafe(message));
        });
      });
    });
}