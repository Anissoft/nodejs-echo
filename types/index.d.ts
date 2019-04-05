export type WSEvent = any; // TODO
export type WSListener = (event: WSEvent) => void;
export interface Request {
  id: string;
  type: 'outgoing' | 'incoming';
  status: 'pending' | 'success' | 'errored';
  url?: string | URL;
  options: {
    auth: any
    hash: any
    headers: { [key: string]: string[] },
    host: string,
    hostname: string,
    href: string,
    method: string,
    path: string,
    pathname: string,
    port: any
    protocol: string
    query: any
    search: any
    slashes: boolean
  };
}
