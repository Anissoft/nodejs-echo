import * as http from 'http';
import { collect, interceptWritable } from './writable';
import { getId, setId } from '../utils/id';
import { parseRawHeaders } from '../utils/headers';
import { NetworkEvent, NetworkEventType } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */

const clientRequestEmit = http.ClientRequest.prototype.emit;

export const interceptClientRequest = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.ClientRequest, event: string | symbol, ...args: any[]) {
    switch (event) {
      case 'socket':
        setId(this);
        capture({
          type: NetworkEventType.Request,
          id: getId(this),
          method: this.method,
          url: (this as any)._redirectable?._currentUrl || `${this.protocol}//${this.getHeader('host') || this.host}${this.path}`,
          timeStart: Date.now(),
          incoming: false,
        });
        break;
      case 'response':
        const response: http.IncomingMessage = args[0];
        setId(this, response);
        break;
      case 'finish':
        const id = getId(this);
        capture({
          id,
          type: NetworkEventType.RequestHeaders,
          requestHeaders: Object.assign({}, this.getHeaders(), parseRawHeaders((this as any)._header)),
        });
        capture({
          id,
          type: NetworkEventType.RequestData,
          request: collect(id, this.getHeaders()['content-encoding']?.toString()),
        });
        break;
    }
    return clientRequestEmit.call(this, event, ...args);
  }

  http.ClientRequest.prototype.emit = emitInterceptor;
};

Object.defineProperty(http.OutgoingMessage.prototype, '_writable_', {
  value: false,
  writable: true,
});

Object.defineProperty(http.OutgoingMessage.prototype, '_intercepted_', {
  value: false,
  writable: true,
});

Object.defineProperty(http.OutgoingMessage.prototype, 'writable', {
  set: function writable(value: boolean) {
    this._writable_ = value;
    if (!this._intercepted_) {
      setId(this);
      interceptWritable.call(this);
    }
    this._intercepted_ = true;
  },
  get: function writable() {
    return this._writable_;
  },
});
