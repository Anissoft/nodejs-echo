/* eslint-disable @typescript-eslint/no-explicit-any */

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value?: object | string | number) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const hidePrivateKeys = (source: object) => {
  const replacer = getCircularReplacer();
  const hide = (source: object) =>
    Object.entries(source).reduce((acc, [key, value]) => {
      if (/^_/.test(key)) {
        acc._ = (acc._ || {}) as Record<string, any>;
        acc._[key.replace(/^_+/, '')] = value;
      } else {
        const uniqValue = replacer(key, value);
        acc[key] = !!uniqValue && typeof uniqValue === 'object' ? hide(uniqValue) : uniqValue;
      }
      return acc;
    }, {} as { _: Record<string, any>; [key: string]: object | number | string | undefined });
  return hide(source);
};

export const stringifySafe = (source: Record<string, any>): string =>
  JSON.stringify(hidePrivateKeys(source), getCircularReplacer());

export function mergeDeep<
  T extends Record<string, any>, 
  K extends Record<string, any>
>(target: T, ...sources: K[]): T & K | T {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift() as K;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function isObject(candidate: object) {
  return candidate && typeof candidate === 'object' && !Array.isArray(candidate);
}
