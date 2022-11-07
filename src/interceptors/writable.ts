import * as stream from 'stream';
import { getId } from '../utils/id';
import { parseBodyFromChunks } from '../utils/body';

/* eslint-disable @typescript-eslint/no-explicit-any */
const PAYLOADS = new Map<string, { chunks: any[]; encoding: BufferEncoding }>();

export function intercept(this: stream.Writable, method: 'write' | 'end') {
  const originalMethod = this[method];
  const interceptor = (chunk: any, ...args: any[]): any => {
    if (chunk !== null) {
      const id = getId(this);
      const encoding = (typeof args[0] === 'string' ? args[0] : 'utf8') as BufferEncoding;
      const record = PAYLOADS.get(id) ?? {
        chunks: [],
        encoding,
      };

      record.chunks.push(chunk);
      PAYLOADS.set(id, record);
    }

    return (originalMethod as any).apply(this, [chunk, ...args] as any);
  };

  this[method] = interceptor;
}

export function interceptWritable(this: stream.Writable) {
  intercept.call(this, 'write');
  intercept.call(this, 'end');
}

export function collect(id: string, contentEncoding?: string) {
  const record = PAYLOADS.get(id);

  if (!record) {
    return '';
  }

  const payload = parseBodyFromChunks(record.chunks, contentEncoding, record.encoding);
  PAYLOADS.delete(id);
  return payload;
}
