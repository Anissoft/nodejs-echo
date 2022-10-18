import * as stream from 'stream';

export function interceptWrite(writable: stream.Writable, onWrite:(chunk: any, encoding: string) => void) {
  const originalWrite = writable.write;

  function write(chunk: any, callback?: (error: Error | null | undefined) => void): boolean;
  function write(chunk: any, encoding: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean;
  function write(chunk: any, ...args: any[]): boolean {
    const encoding = args.length >0 && typeof args[0] === 'string' ? args[0] : 'utf8';

    onWrite(chunk, encoding);

    return originalWrite.apply(writable, [chunk, ...args] as any);
  }

  writable.write = write;
}

export function interceptEnd(writable: stream.Writable, onWrite:(chunk: any, encoding: string) => void) {
  const originalEnd = writable.end;

  function end(callback?: (error: Error | null | undefined) => void): stream.Writable;
  function end(chunk: any, callback?: (error: Error | null | undefined) => void): stream.Writable;
  function end(chunk: any, encoding: BufferEncoding, callback?: (error: Error | null | undefined) => void): stream.Writable;
  function end(chunk: any, ...args: any[]): stream.Writable {
    const encoding = args.length >0 && typeof args[0] === 'string' ? args[0] : 'utf8';

    onWrite(chunk, encoding);

    return originalEnd.apply(writable, [chunk, ...args] as any);
  }

  writable.end = end;
}
