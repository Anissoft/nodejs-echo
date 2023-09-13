export const parseRawHeaders = (rawHeaders = '') => {
  try {
    return Object.fromEntries(
      rawHeaders
        .replace(/\r/g, '')
        .split('\n')
        .filter((str) => str.includes(':'))
        .map((str) => str.split(': '))
        .map(([key, value]) => [key.toLowerCase(), value])
    );
  } catch (e) {
    return {};
  }
};

export const formatHeaders = (headers: HeadersInit | undefined) => {
  if (!headers) {
    return {};
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  if (headers instanceof Headers) {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => (record[key] = value));
    return record;
  }

  return headers;
};
