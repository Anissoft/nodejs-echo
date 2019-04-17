
export const getMethod = (e: any): string => {
  if (e.request) {

    if (typeof e.request === 'string') {
      return '[GET]'
    }
    if ((e.request as any).method) {
      return `[${(e.request as any).method.toUpperCase()}]`;
    }
  }
  return '[UNKNOWN]'
}

export const getHost = (e: any): string => {
  if (e.request) {
    const {
      href,
      host, port,
      hostname, protocol,
    } = (e.request as any)
    if (typeof e.request === 'string' || href) {
      const url = new URL(href || e.request);
      return `${url.protocol}//${url.hostname}:${url.port || ''}`;
    }
    if (host || hostname) {
      return `${protocol || 'http:'}//${host || hostname}${port ? `:${port}` : ''}`;
    }
  }
  return 'undefined'
}

export const getPath = (e: any): string => {
  if (e.request) {
    const {
      href,
      pathname, path,
    } = (e.request as any)
    if (typeof e.request === 'string' || href) {
      const url = new URL(href || e.request);
      return url.pathname;
    }
    if (path || pathname) {
      return (path || pathname);
    }
  }
  return 'undefined'
}

export const getUrl = (e: any): string => {
  if (e.request) {
    const {
      href,
      host, path, port,
      hostname, protocol,
    } = (e.request as any)
    if (typeof e.request === 'string') {
      return e.request as string;
    }
    if (href) {
      return href;
    }
    if (host || hostname) {
      return `${protocol || ''}//${host || hostname}${port ? `:${port}` : ''}${path || ''}`;
    }
  }
  return 'undefined'
}

