// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

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
  var bytes = crypto.randomBytes(buf.length);
  buf.set(bytes);
  return buf;
}

export default () =>
  `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c =>
    (+c ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
  );
