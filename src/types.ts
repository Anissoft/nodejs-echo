export type NetworkEvent = ({
  type: NetworkEventType.Request;
  version?: string;
  method: string;
  url: string;
  timestamp: number;
  headers?: Record<string, string | string[] | undefined>;
  incoming: Boolean; 
} | {
  type: NetworkEventType.RequestHeaders;
  headers: Record<string, string | string[] | number | undefined>;
} | {
  type: NetworkEventType.RequestData;
  payload: string;
} | {
  type: NetworkEventType.ResponseStatus;
  statusCode: number;
  statusMessage?: string;
} | {
  type: NetworkEventType.ResponseData;
  payload: string;
} | {
  type: NetworkEventType.ResponseHeaders;
  headers: Record<string, string | string[] | number | undefined>;
}) & {
  id: string;
}

export enum NetworkEventType {
  Request = 'Request',
  RequestHeaders = 'RequestHeaders',
  RequestData = 'RequestData',
  ResponseStatus = 'ResponseStatus',
  ResponseData = 'ResponseData',
  ResponseHeaders = 'ResponseHeaders',
}