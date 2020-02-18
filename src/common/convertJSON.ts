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

export default (source: object): string => JSON.stringify(source, getCircularReplacer());
