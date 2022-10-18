import * as crypto from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';

function getRandomValues<T1>(buf: T1): T1 {
  if (!(buf instanceof Uint8Array)) {
    throw new TypeError('expected Uint8Array');
  }
  if (buf.length > 65536) {
    throw new Error(
      "Failed to execute 'getRandomValues' on 'Crypto': The " +
        "ArrayBufferView's byte length (" +
        buf.length +
        ') exceeds the ' +
        'number of bytes of entropy available via this API (65536).',
    );
  }
  const bytes = crypto.randomBytes(buf.length);
  buf.set(bytes);
  return buf;
}

export const getRandomId = () =>
  `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c =>
    (+c ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
  );

export const setId= (req: IncomingMessage, res?: ServerResponse) => {
  const id = (req as any)._id_ ?? (res as any)._id_ ?? getRandomId();
  (req as any)._id_ = id;
  (res as any)._id_ = id;
}

export const getId = (t: IncomingMessage | ServerResponse): string => {
  return (t as any)._id_;
}