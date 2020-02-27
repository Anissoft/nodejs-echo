export type WSEvent = any; // TODO
export type WSListener = (event: WSEvent) => void;
export interface Request {
  id: string;
  type: 'outgoing' | 'incoming';
  url?: string | URL;
  request: {
    auth: any;
    hash: any;
    headers: { [key: string]: string[] };
    host: string;
    hostname: string;
    href?: string;
    method: string;
    path: string;
    pathname: string;
    port: any;
    protocol: string;
    url: string;
    query: any;
    search: any;
    slashes: boolean;
    time: number;
  };
}
export interface RequestBody {
  id: string;
  type: 'outgoing' | 'incoming';
  request: {
    body: string;
  };
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
    body: string | null;
    time: number;
  };
}

export type Item = Response | Request | RequestBody;
export type CompleteItem = Request & Partial<RequestBody> & Partial<Response>;
