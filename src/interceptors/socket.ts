import * as net from 'net';
import { NetworkEvent } from '../types';

const socketWrite = net.Socket.prototype.write;

export const interceptSocketWrite = (capture: (event: NetworkEvent) => void) => {
  function write(buffer: Uint8Array | string, cb?: (err?: Error) => void): boolean;
  function write(str: Uint8Array | string, encoding?: string, cb?: (err?: Error) => void): boolean;
  function write(this: net.Socket, data: Uint8Array | string, ...args: any[]) {
    capture({ type: 'write', payload: data } as any);
    return socketWrite.call(this, data, ...args);
  }

  net.Socket.prototype.write = write;
}


