import { deflateSync, unzipSync } from 'zlib';

export const parseBodyFromChunks = (
  chunks?: Array<Buffer | string>,
  contentEncoding?: string,
  encoding: BufferEncoding = 'base64',
) => {
  chunks = chunks?.filter(Boolean);
  if (chunks == null || chunks.length === 0) {
    return '';
  }
  
  let raw: Buffer;

  if (Buffer.isBuffer(chunks[0])) {
    raw = Buffer.concat(chunks as Buffer[]);
  } else {
    if (chunks.length > 0 && chunks[0] && chunks[0].length > 0 && chunks[0][0] === '\uFEFF') {
      chunks[0] = chunks[0].substring(1);
    }
    raw = Buffer.from(chunks.join(''), 'utf-8');
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
