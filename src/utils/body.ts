import { deflateSync, unzipSync } from 'zlib';

export const parseBodyFromChunks = (
  chunks?: (Buffer | string)[],
  contentEncoding?: string,
  encoding: BufferEncoding = 'utf8',
) => {
  chunks = chunks?.filter(Boolean);
  if (!chunks || chunks.length === 0) {
    return '';
  }
  let raw: string | Buffer;
  if (Buffer.isBuffer(chunks[0])) {
    raw = Buffer.concat(chunks as Buffer[]);
  } else {
    if (chunks.length > 0 && chunks[0] && chunks[0].length > 0 && chunks[0][0] === '\uFEFF') {
      chunks[0] = chunks[0].substring(1);
    }
    raw = chunks.join('');
  }

  switch (contentEncoding) {
    case 'br':
      return deflateSync(raw).toString(encoding);
    case 'deflate':
    case 'gzip':
      return unzipSync(raw).toString(encoding);
    default:
      return raw.toString(encoding);
  }
};
