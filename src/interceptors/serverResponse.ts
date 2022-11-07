import * as http from 'http';
import { NetworkEvent, NetworkEventType } from '../types';
import { collect } from './writable';
import { getId } from '../utils/id';
import { parseRawHeaders } from '../utils/headers';

/* eslint-disable @typescript-eslint/no-explicit-any */

const serverResponseEmit = http.ServerResponse.prototype.emit;

export const interceptServerResponse = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.ServerResponse, event: string | symbol, ...args: any[]) {
    const id = getId(this);

    switch (event) {
      case 'finish':
        capture({
          id,
          type: NetworkEventType.ResponseHeaders,
          responseHeaders: Object.assign(
            {},
            this.getHeaders(),
            parseRawHeaders((this as any)._header),
          ),
        });
        capture({
          id,
          type: NetworkEventType.ResponseStatus,
          statusCode: this.statusCode,
          statusMessage: this.statusMessage,
          timeEnd: Date.now(),
        });
        capture({
          id,
          type: NetworkEventType.ResponseData,
          response: collect(id, this.getHeader('content-encoding') as string),
        });
        break;
    }
    return serverResponseEmit.call(this, event, ...args);
  }

  http.ServerResponse.prototype.emit = emitInterceptor;
};
