import * as http from 'http';
import { NetworkEvent, NetworkEventType } from '../types';
import { collect, interceptWritable } from './writable';
import { getId } from '../utils/id';
import { parseRawHeaders } from '../utils/headers';

const serverResponseEmit = http.ServerResponse.prototype.emit;

export const interceptServerResponse = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.ServerResponse, event: string | symbol, ...args: any[]) {
    switch(event) {
      case "socket":
        interceptWritable.call(this);
        break;
      case "finish":
        const id = getId(this);
        capture({ 
          id, 
          type: NetworkEventType.ResponseHeaders, 
          headers: Object.assign(
            {}, 
            this.getHeaders(), 
            parseRawHeaders((this as any)._header),
          )
        });
        capture({ 
          id, 
          type: NetworkEventType.ResponseStatus, 
          statusCode: this.statusCode, 
          statusMessage: this.statusMessage,
        });
        capture({ 
          id,
          type: NetworkEventType.ResponseData, 
          payload: collect(id, this.getHeader('content-encoding') as string),
        });
        break;  
    }
    return serverResponseEmit.call(this, event, ...args);
  }

  http.ServerResponse.prototype.emit = emitInterceptor;
}
