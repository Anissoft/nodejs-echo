import * as stream from 'stream';

export function interceptWrite(stream: stream.Writable, onWrite:(chunk: any, encoding: string) => void) {
  const originalWrite = stream.write;
  function write(chunk: any, callback?: (error: Error | null | undefined) => void): boolean;
  function write(chunk: any, encoding: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean;
  function write(chunk: any, ...args: any[]): boolean {
    const encoding = args.length >0 && typeof args[0] === 'string' ? args[0] : 'utf8';
    onWrite(chunk, encoding);
    return originalWrite(chunk, ...args);
  }

  stream.write = write;
}