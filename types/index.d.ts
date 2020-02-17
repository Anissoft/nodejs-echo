export type WSEvent = any; // TODO
export type WSListener = (event: WSEvent) => void;
export interface Request {
  id: string;
  type: 'outgoing' | 'incoming';
  url?: string | URL;
  request:
    | string
    | {
        auth: any;
        hash: any;
        headers: { [key: string]: string[] };
        host: string;
        hostname: string;
        href: string;
        method: string;
        path: string;
        pathname: string;
        port: any;
        protocol: string;
        query: any;
        search: any;
        slashes: boolean;
      };
}
export interface RequestBody {
  id: string;
  type: 'outgoing' | 'incoming';
  body: string[];
}

export interface Response {
  id: string;
  response: {
    httpVersion: string;
    headers: { [key: string]: string[] };
    method?: string;
    url?: string | URL;
    statusCode?: number;
    statusMessage?: string;
    data: string | null;
  };
}
