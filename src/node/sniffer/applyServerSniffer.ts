import * as http from 'http';
import * as https from 'https';

import { Request, Response, RequestBody } from '../../types';
import generateId from '../../common/generateId';

function applyServerSniffer(
  original: typeof http,
  effect: (info: Request | Response | RequestBody) => void,
): typeof http.createServer;
function applyServerSniffer(
  original: typeof https,
  effect: (info: Request | Response | RequestBody) => void,
): typeof https.createServer;
function applyServerSniffer(
  original: typeof http | typeof https,
  effect: (info: Request | Response | RequestBody) => void,
) {
  const originalCreateServer = original.createServer;

  function createServer(
    originalOptions?: http.RequestListener | http.ServerOptions,
    originalListener?: http.RequestListener,
  ) {
    let options: {};
    let listener: http.RequestListener;

    if (typeof originalOptions === 'undefined') {
      options = {};
      listener = () => {};
    } else if (typeof originalOptions === 'function') {
      options = {};
      listener = originalOptions;
    } else {
      options = originalOptions;
      listener = originalListener || (() => {});
    }

    const spy = (req: http.IncomingMessage, res: http.ServerResponse) => {
      try {
        const id = generateId();
        const originalWrite = res.write;
        const originalEnd = res.end;
        const originalSet = res.setHeader;
        const buffers = {
          request: '',
          response: '',
        };
        const headers: Record<string, string | number | string[]> = {};

        req.on('data', chunk => {
          buffers.request += chunk;
        });

        req.on('end', () => {
          effect({
            id,
            type: 'incoming',
            request: {
              body: buffers.request,
            },
          });
        });

        res.write = function(chunk: any) {
          buffers.response += chunk;
          return originalWrite.apply(this, arguments as any);
        };

        res.end = function(...args: any[]) {
          if (typeof args[0] !== 'function') {
            const [chunk] = args;
            buffers.response += chunk;
          }
          return originalEnd.apply(this, arguments as any);
        };

        res.setHeader = function(name, value) {
          Object.assign(headers, { [name]: value });
          return originalSet.apply(this, arguments as any);
        };

        res.on('finish', function() {
          effect({
            id,
            type: 'incoming',
            response: Object.assign({}, (res as unknown) as Response['response'], {
              time: Date.now(),
              body: buffers.response,
              headers,
            }),
          });
        });
        effect({
          id,
          type: 'incoming',
          request: Object.assign({}, (req as unknown) as Request['request'], {
            time: Date.now(),
            body: buffers.request,
          }),
        });

      } catch (e) {
        console.log(e);
      }
      return listener(req, res);
    };

    const server = originalCreateServer(options, spy);
    return server;
  }
  if (original === http) {
    return createServer as typeof http.createServer;
  }
  return createServer as typeof https.createServer;
}

export default applyServerSniffer;
