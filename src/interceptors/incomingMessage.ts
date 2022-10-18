import * as http from 'http';
import { getId } from '../utils/id';
import { NetworkEvent, NetworkEventType } from '../types';
import { parseBodyFromChunks } from '../utils/body';

const BODIES: Record<string, any[]> = {};
const incomingMessageEmit = http.IncomingMessage.prototype.emit;

export const interceptIncomingMessage = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.IncomingMessage, event: string | symbol, ...args: any[]) {
    const id = getId(this);
    
    switch(event) {
      case "data":
        const chunk: string | Buffer = args[0];
        if (!BODIES[id]) {
          BODIES[id] = [];
        }
        BODIES[id].push(chunk);
        break;
      case "end":
        capture({ 
          id,
          type: NetworkEventType.IncomingData, 
          body: parseBodyFromChunks(BODIES[id], this.headers['content-encoding']),
        });
        delete BODIES[id];
        break;  
      }

    return incomingMessageEmit.call(this, event, ...args);
  }

  http.IncomingMessage.prototype.emit = emitInterceptor;
}


