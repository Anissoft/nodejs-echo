import { EventEmitter } from 'events';

import { interceptClientRequest } from './interceptors/clientRequest';
import { interceptFetchCalls } from './interceptors/fetch';
import { interceptIncomingMessage } from './interceptors/incomingMessage';
import { interceptServer } from './interceptors/server';
import { interceptServerResponse } from './interceptors/serverResponse';
import {
  NetworkEvent,
  NetworkEventType,
  RequestEvent,
  RequestItem,
} from './types';

const buffer: Record<string, RequestItem> = {};

export const emitter = new EventEmitter();
export const captureEvent = (event: NetworkEvent) => {
  try {
    emitter.emit('message-to-socket', event);

    if (event.type === NetworkEventType.Request) {
      buffer[event.id] = event;
    } else if (buffer[event.id]) {
      Object.assign(buffer[event.id], event);
    } else {
      // WUT?
      buffer[event.id] = event;
    }

    if (event.type === NetworkEventType.RequestData) {
      emitter.emit(
        buffer[event.id]?.incoming
          ? RequestEvent.incomingRequestStart
          : RequestEvent.outgoingRequestStart,
        buffer[event.id]
      );
    }

    if (event.type === NetworkEventType.ResponseData) {
      emitter.emit(
        buffer[event.id]?.incoming
          ? RequestEvent.incomingRequestFinish
          : RequestEvent.outgoingRequestFinish,
        buffer[event.id]
      );
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      delete buffer[event.id];
    }
  } catch (error) {
    console.error(error);
  }
};

interceptServer(captureEvent);
interceptIncomingMessage(captureEvent);
interceptServerResponse(captureEvent);
interceptClientRequest(captureEvent);
interceptFetchCalls(captureEvent);

export function subscribe(
  eventName: RequestEvent,
  cb: (m: RequestItem) => void
) {
  emitter.on(eventName, cb);

  return () => emitter.off(eventName, cb);
}

export const subscribeToRequests = subscribe;
export * from './types';
