import * as crypto from 'crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */

function getRandomValues<T1>(buf: T1): T1 {
  if (!(buf instanceof Uint8Array)) {
    throw new TypeError('expected Uint8Array');
  }
  if (buf.length > 65536) {
    throw new Error(
      `Failed to execute 'getRandomValues' on 'Crypto': The 
      ArrayBufferView's byte length (${buf.length.toString()}) exceeds the
      number of bytes of entropy available via this API (65536).`,
    );
  }
  const bytes = crypto.randomBytes(buf.length);
  buf.set(bytes);
  return buf;
}

export const getRandomId = () =>
  `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
    (+c ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
  );

export const setId = (req: any, res?: any) => {
  const id = req._id_ ?? res?._id_ ?? getRandomId();
  req._id_ = id;
  if (res) {
    res._id_ = id;
  }
};

export const getId = (t: any): string => {
  return t._id_;
};
