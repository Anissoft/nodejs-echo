import { NetworkEvent, NetworkEventType } from '../types';
import { formatHeaders } from '../utils/headers';
import { getRandomId } from '../utils/id';

const originalFetch = globalThis.fetch;

export const interceptFetchCalls = (capture: (event: NetworkEvent) => void) => {
  if (typeof fetch !== 'undefined') {
    globalThis.fetch = async function (
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ): Promise<Response> {
      const id = getRandomId();
      const url = (() => {
        if (typeof input === 'string') {
          return input;
        }
        if (input instanceof URL) {
          return input.toString();
        }

        return input.url;
      })();

      capture({
        type: NetworkEventType.Request,
        id,
        method: init?.method ?? 'GET',
        url: url,
        timeStart: Date.now(),
        incoming: false,
      });
      capture({
        id,
        type: NetworkEventType.RequestHeaders,
        requestHeaders: formatHeaders(init?.headers),
      });
      capture({
        id,
        type: NetworkEventType.RequestData,
        request:
          init?.body instanceof ReadableStream
            ? '::stream::'
            : JSON.stringify(init?.body),
      });

      const response = await originalFetch(input, init);

      capture({
        id,
        type: NetworkEventType.ResponseStatus,
        statusCode: response.status,
        statusMessage: response.statusText,
        timeEnd: Date.now(),
      });

      const responseHeaders = formatHeaders(response.headers);

      capture({
        id,
        type: NetworkEventType.ResponseHeaders,
        responseHeaders,
      });

      response
        .clone()
        .arrayBuffer()
        .then((arrayBuffer) => {
          capture({
            id,
            type: NetworkEventType.ResponseData,
            response: Buffer.from(arrayBuffer).toString('base64'),
          });
        });

      return response;
    };
  }
};
