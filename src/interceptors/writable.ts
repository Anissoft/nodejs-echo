import * as stream from 'stream';
import { getId } from '../utils/id';
import { parseBodyFromChunks } from '../utils/body';

const PAYLOADS: Record<string, {chunks: any[]; encoding: BufferEncoding}> = {};

export function intercept(
  this: stream.Writable,
  method: 'write' | 'end',
) {
  const originalMethod = this[method];
  const interceptor = (chunk: any, ...args: any[]): any => {
    const id = getId(this);
    const encoding = (typeof args[0] === 'string' ? args[0] : 'utf8') as BufferEncoding;

    if (!PAYLOADS[id]) {
      PAYLOADS[id] = {
        chunks: [],
        encoding,
      };
    }
    if (chunk !== null) {
      PAYLOADS[id].chunks.push(chunk);
    }

    return (originalMethod as any).apply(this, [chunk, ...args] as any);
  }

  this[method] = interceptor;
}

export function interceptWritable(this: stream.Writable) {
  intercept.call(this, 'write');
  intercept.call(this, 'end');
}

export function collect(id: string, contentEncoding?: string) {
  if (!PAYLOADS[id]) {
    return '';
  }
  const payload = parseBodyFromChunks(PAYLOADS[id].chunks, contentEncoding, PAYLOADS[id].encoding);
  delete PAYLOADS[id];
  return payload;
}
