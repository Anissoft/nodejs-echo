import * as http from 'http';
import { deflateSync, unzipSync } from 'zlib';

import { Request, Response, RequestBody } from '../../types';
import generateId from '../../common/generateId';

export default (
  original: typeof http.request,
  effect: (info: Request | Response | RequestBody) => void,
) => {
  function request(
    options: http.RequestOptions | string | URL,
    callback?: (raw: http.IncomingMessage) => void,
  ): http.ClientRequest;
  function request(
    url: string | URL,
    options: http.RequestOptions,
    callback?: (raw: http.IncomingMessage) => void,
  ): http.ClientRequest;
  function request(arg0: any, arg1?: any, arg2?: any): http.ClientRequest {
    let url: string | URL | undefined;
    let options: Request['request'];
    let callback: (raw: http.IncomingMessage) => void;

    try {
      if (!arg1 || typeof arg1 === 'function') {
        url = arg0;
        options = arg0;
        callback = arg1;
      } else {
        url = arg0;
        options = arg1;
        callback = arg2;
      }

      const id = generateId();
      effect({ id, type: 'outgoing', request: Object.assign({}, options, { time: Date.now() }) });

      const req = original(options, response => {
        const { httpVersion, headers, method, url, statusCode, statusMessage } = response;
        const buffers: Array<Buffer> = [];
        const strings: string[] = [];
        let bufferLength = 0;
        let data = '';

        response.prependListener('data', chunk => {
          if (!Buffer.isBuffer(chunk)) {
            strings.push(chunk);
          } else if (chunk.length) {
            bufferLength += chunk.length;
            buffers.push(chunk);
          }
        });

        response.on('end', () => {
          let raw: string | Buffer;
          if (bufferLength) {
            raw = Buffer.concat(buffers, bufferLength);
          } else {
            if (strings.length > 0 && strings[0].length > 0 && strings[0][0] === '\uFEFF') {
              strings[0] = strings[0].substring(1);
            }
            raw = strings.join('');
          }

          switch (response.headers['content-encoding']) {
            case 'br':
              data = deflateSync(raw).toString('utf8');
              break;
              case 'deflate':
            case 'gzip':
              data = unzipSync(raw).toString('utf8');
              break;
            default:
              data = raw.toString('utf8');
              break;
          }

          effect({
            id,
            response: {
              httpVersion,
              headers: headers as { [key: string]: string[] },
              method,
              url,
              statusCode,
              statusMessage,
              body: data,
              time: Date.now(),
            },
          });
        });

        callback && callback(response);
      });

      const originalWrite = req.write;
      const originalEnd = req.end;
      let buffer: any = '';
      req.write = function(chunk: any) {
        buffer += chunk;
        return originalWrite.apply(this, arguments as any);
      };
      req.end = function() {
        effect({
          id,
          type: 'outgoing',
          request: {
            body: buffer,
          },
        });
        return originalEnd.apply(this, arguments as any);
      };

      return req;
    } catch (e) {
      console.error(e);
    }
    return original(arg0, arg1, arg2);
  }
  return request;
};
