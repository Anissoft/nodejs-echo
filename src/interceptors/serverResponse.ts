import * as http from 'http';
import { getId } from '../utils/id';
import { NetworkEvent, NetworkEventType } from '../types';
import { interceptWrite } from './writableWrite';
import { parseBodyFromChunks } from '../utils/body';

const PAYLOADS: Record<string, any[]> = {};
const serverResponseEmit = http.ServerResponse.prototype.emit;

export const interceptServerResponse = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.ServerResponse, event: string | symbol, ...args: any[]) {
    const onChunk = (chunk: any) => {
      const id = getId(this);
      if (!PAYLOADS[id]) {
        PAYLOADS[id] = [];
      }
      PAYLOADS[id].push(chunk);
    }
    switch(event) {
      case "socket":
        interceptWrite(this, onChunk);
        break;
      case "finish":
        const id = getId(this);
        capture({ id, type: NetworkEventType.IncomingResponseHeaders, headers: Object.assign({},this.getHeaders()) });
        capture({ id, type: NetworkEventType.IncomingResponseStatus, statusCode: this.statusCode, statusMessage: this.statusMessage });
        capture({ 
          id,
          type: NetworkEventType.IncomingResponseData, 
          payload: parseBodyFromChunks(PAYLOADS[id], this.getHeaders()['content-encoding']?.toString()),
        });
        delete PAYLOADS[id];
        break;  
    }
    return serverResponseEmit.call(this, event, ...args);
  }

  http.ServerResponse.prototype.emit = emitInterceptor;
}


