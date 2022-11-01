import * as http from 'http';
import { getId } from '../utils/id';
import { NetworkEvent, NetworkEventType } from '../types';
import { parseBodyFromChunks } from '../utils/body';

/* eslint-disable @typescript-eslint/no-explicit-any */

const BODIES: Record<string, { chunks: any[]; encoding: BufferEncoding }> = {};
const incomingMessageEmit = http.IncomingMessage.prototype.emit;

export const interceptIncomingMessage = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.IncomingMessage, event: string | symbol, ...args: any[]) {
    const id = getId(this);

    switch (event) {
      case 'data':
        const chunk: string | Buffer = args[0];
        const encoding = (typeof args[1] === 'string' ? args[1] : 'utf8') as BufferEncoding; // TODO
        if (!BODIES[id]) {
          BODIES[id] = {
            chunks: [],
            encoding,
          };
        }
        BODIES[id].chunks.push(chunk);
        break;
      case 'end':
        const isResponse = typeof this.statusCode !== 'undefined' && this.statusCode !== null;
        if (isResponse) {
          capture({
            id,
            type: NetworkEventType.ResponseStatus,
            statusCode: (this as any).statusCode,
            statusMessage: (this as any).statusMessage,
            timeEnd: Date.now(),
          });

          capture({
            id,
            type: NetworkEventType.ResponseHeaders,
            responseHeaders: Object.assign({}, (this as any).headers),
          });
        } else {
          capture({
            id,
            type: NetworkEventType.RequestHeaders,
            requestHeaders: Object.assign({}, (this as any).headers),
          });
        }

        if (BODIES[id]) {
          if (isResponse) {
            capture({
              id,
              type: NetworkEventType.ResponseData,
              response: parseBodyFromChunks(
                BODIES[id].chunks,
                this.headers['content-encoding'],
                BODIES[id].encoding,
              ),
            });
          } else {
            capture({
              id,
              type:  NetworkEventType.RequestData,
              request: parseBodyFromChunks(
                BODIES[id].chunks,
                this.headers['content-encoding'],
                BODIES[id].encoding,
                ),
            });
          }
          delete BODIES[id];
        }
        break;
    }

    return incomingMessageEmit.call(this, event, ...args);
  }

  http.IncomingMessage.prototype.emit = emitInterceptor;
};
