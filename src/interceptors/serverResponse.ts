import * as http from 'http';
import { getId } from '../utils/id';
import { NetworkEvent, NetworkEventType } from '../types';
import { interceptWrite } from './writableWrite';
import { parseBodyFromChunks } from '../utils/body';

const PAYLOADS: Record<string, any[]> = {};
const serverResponseEmit = http.ServerResponse.prototype.emit;

export const interceptServerResponse = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.ServerResponse, event: string | symbol, ...args: any[]) {
    const id = getId(this);
    capture({ 
      type: NetworkEventType.IncomingResponseHeaders, 
      id,
      headers: this.getHeaders(),
    });
    switch(event) {
      case "socket":
        interceptWrite(this, (chunk, encoding) => {
          if (!PAYLOADS[id]) {
            PAYLOADS[id] = [];
          }
          PAYLOADS[id].push(chunk);
        });
        break;
      case "finish": 
        capture({ 
          type: NetworkEventType.IncomingResponseData, 
          id,
          payload: parseBodyFromChunks(PAYLOADS[id], this.getHeaders()['content-encoding']?.toString()),
        });
        delete PAYLOADS[id];
        break;  
    }
    capture({ type: 'sr+' + (event as any), payload: args} as any)
    return serverResponseEmit.call(this, event, ...args);
  }

  http.ServerResponse.prototype.emit = emitInterceptor;
}


