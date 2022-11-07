export const parseRawHeaders = (rawHeaders = '') => {
  try {
    return Object.fromEntries(
      rawHeaders
        .replace(/\r/g, '')
        .split('\n')
        .filter((str) => str.includes(':'))
        .map((str) => str.split(': '))
        .map(([key, value]) => [key.toLowerCase(), value]),
    );
  } catch (e) {
    return {};
  }
};
