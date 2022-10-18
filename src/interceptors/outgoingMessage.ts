import * as http from 'http';
import { getId } from '../utils/id';
import { NetworkEvent } from '../types';

const outgoingMessageEmit = http.OutgoingMessage.prototype.emit;

export const interceptOutgoingMessage = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.OutgoingMessage, event: string | symbol, ...args: any[]) {
    // const id = getId(this);
    switch(event) {
      case "socket":
      break;
    }
    capture({ type: 'om' + (event as any), payload: args} as any)
    return outgoingMessageEmit.call(this, event, ...args);
  }

  http.OutgoingMessage.prototype.emit = emitInterceptor;
}


