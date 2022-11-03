import * as http from 'http';
import * as https from 'https';
import { getId, setId } from '../utils/id';
import { NetworkEvent, NetworkEventType } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */

const httpServerEmit = http.Server.prototype.emit;
const httpsServerEmit = https.Server.prototype.emit;

export const interceptServer = (capture: (event: NetworkEvent) => void) => {
  function emitInterceptor(this: http.Server, event: string | symbol, ...args: any[]) {
    switch (event) {
      case 'request':
        const [req, res] = args as [http.IncomingMessage, http.ServerResponse];
        setId(req, res);
        capture({
          id: getId(req),
          type: NetworkEventType.Request,
          method: req.method!,
          version: req.httpVersion,
          url: `http${this instanceof http.Server ? '' : 's'}://${
            req.headers['host'] || 'localhost'
          }${req.url}`,
          timeStart: Date.now(),
          requestHeaders: req.headers,
          incoming: true,
        });
        break;
    }

    return this instanceof http.Server
      ? (httpServerEmit as any).call(this, event, ...args)
      : (httpsServerEmit as any).call(this, event, ...args);
  }

  http.Server.prototype.emit = emitInterceptor;
  https.Server.prototype.emit = emitInterceptor;
};
