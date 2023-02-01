import * as http from 'http';
import { getId } from '../utils/id';
import { NetworkEvent, NetworkEventType } from '../types';
import { parseBodyFromChunks } from '../utils/body';

/* eslint-disable @typescript-eslint/no-explicit-any */

const BODIES = new Map<string, { chunks: any[]; encoding: BufferEncoding }>();
const incomingMessageEmit = http.IncomingMessage.prototype.emit;

export const interceptIncomingMessage = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.IncomingMessage, event: string | symbol, ...args: any[]) {
    const id = getId(this);
    const isResponse = typeof this.statusCode !== 'undefined' && this.statusCode !== null;

    switch (event) {
      case 'data':
        BODIES.set(
          id,
          (() => {
            const record = BODIES.get(id) ?? {
              chunks: [],
              encoding: (typeof args[1] === 'string' ? args[1] : 'base64') as BufferEncoding,
            };

            record.chunks.push(args[0]);
            return record;
          })(),
        );
        break;
      case 'end':
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

          capture({
            id,
            type: NetworkEventType.ResponseData,
            response: parseBodyFromChunks(
              BODIES.get(id)?.chunks,
              this.headers['content-encoding'],
              BODIES.get(id)?.encoding,
            ),
          });
        } else {
          capture({
            id,
            type: NetworkEventType.RequestHeaders,
            requestHeaders: Object.assign({}, (this as any).headers),
          });

          capture({
            id,
            type: NetworkEventType.RequestData,
            request: parseBodyFromChunks(
              BODIES.get(id)?.chunks,
              this.headers['content-encoding'],
              BODIES.get(id)?.encoding,
            ),
          });
        }

        BODIES.delete(id);
        break;
    }

    return incomingMessageEmit.call(this, event, ...args);
  }

  http.IncomingMessage.prototype.emit = emitInterceptor;
};
