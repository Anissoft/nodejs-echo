/* eslint-disable  prefer-rest-params */
import * as http from 'http';

import { Request, Response, RequestBody } from '../../types';
import generateId from '../../common/generateId';

export default (
  original: typeof http.request,
  effect: (info: Request | Response | RequestBody) => void,
  debug = false,
) => {
  if (debug) {
    console.log('apply sniffer on', original.name);
  }
  function request(
    options: http.RequestOptions | string | URL,
    callback?: (res: http.IncomingMessage) => void,
  ): http.ClientRequest;
  function request(
    url: string | URL,
    options: http.RequestOptions,
    callback?: (res: http.IncomingMessage) => void,
  ): http.ClientRequest;
  function request(arg0: any, arg1?: any, arg2?: any): http.ClientRequest {
    let url: string | URL | undefined;
    let options: Request['request'];
    let callback: (res: http.IncomingMessage) => void;

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

      if (debug) {
        console.log('send request for', id);
      }

      const req = original(options, res => {
        const { httpVersion, headers, method, url, statusCode, statusMessage } = res;

        const buffers: Array<Buffer> = [];
        const strings: string[] = [];
        let bufferLength = 0;
        let data = '';

        res.on('data', chunk => {
          if (!Buffer.isBuffer(chunk)) {
            strings.push(chunk);
          } else if (chunk.length) {
            bufferLength += chunk.length;
            buffers.push(chunk);
          }
        });

        res.on('end', () => {
          if (bufferLength) {
            data = Buffer.concat(buffers, bufferLength).toString('utf8');
          } else if (strings.length) {
            if (strings[0].length > 0 && strings[0][0] === '\uFEFF') {
              strings[0] = strings[0].substring(1);
            }
            data = strings.join('');
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
              data,
              time: Date.now(),
            },
          });
          if (debug) {
            console.log('send response for', id);
          }
        });

        callback && callback(res);
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
          body: buffer,
        });
        if (debug) {
          console.log('send request body for', id);
        }
        return originalEnd.apply(this, arguments as any);
      };
      return req;
    } catch (e) {
      console.error(e);
    }
    console.log('use original', original.name);
    return original(arg0, arg1, arg2);
  }
  return request;
};
