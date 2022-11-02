export function cls(...args: (string | undefined | null | {[key: string]: boolean})[]) {
  return args.filter(item => Boolean(item)).reduce((className: string, item) => {
    if (!item) {
      return className
    }

    if (typeof item === 'string') {
      return `${className} ${item.trim()}`;
    }
    return className + ' ' + Object.entries(item)
      .filter(([name, exist]) => exist && name)
      .map(([name]) => name)
      .join(' ');
  }, '').trim();
}