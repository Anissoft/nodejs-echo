export type Merge<T extends object> = {
  [K in T extends any ? keyof T : never]: T extends { [k in K]?: any }
    ? T[K]
    : undefined;
};

export type NetworkEvent = (
  | {
      type: NetworkEventType.Request;
      version?: string;
      method: string;
      url: string;
      timeStart: number;
      requestHeaders?: Record<string, string | string[] | undefined>;
      incoming: boolean;
    }
  | {
      type: NetworkEventType.RequestHeaders;
      requestHeaders: Record<string, string | string[] | undefined>;
    }
  | {
      type: NetworkEventType.RequestData;
      request: string;
    }
  | {
      type: NetworkEventType.ResponseStatus;
      statusCode: number;
      statusMessage?: string;
      timeEnd: number;
    }
  | {
      type: NetworkEventType.ResponseData;
      response: string;
    }
  | {
      type: NetworkEventType.ResponseHeaders;
      responseHeaders: Record<string, string | string[] | undefined>;
    }
) & {
  id: string;
};

export enum NetworkEventType {
  Request = 'Request',
  RequestHeaders = 'RequestHeaders',
  RequestData = 'RequestData',
  ResponseStatus = 'ResponseStatus',
  ResponseData = 'ResponseData',
  ResponseHeaders = 'ResponseHeaders',
}

export enum RequestEvent {
  incomingRequestStart = 'incoming-start',
  incomingRequestFinish = 'incoming-finish',
  outgoingRequestStart = 'outgoing-start',
  outgoingRequestFinish = 'outgoing-finish',
}

export type RequestItem = Partial<Omit<Merge<NetworkEvent>, 'type'>>;
