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

export default (source: Record<string, any>): string =>
  JSON.stringify(hidePrivateKeys(source), getCircularReplacer());
