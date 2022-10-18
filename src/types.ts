export type NetworkEvent = ({
  type: NetworkEventType.IncomingRequest;
  version?: string;
  method: string;
  url: string;
  timestamp: number;
  headers: Record<string, string | string[] | undefined>;
} | {
  type: NetworkEventType.IncomingData;
  body: string;
} | {
  type: NetworkEventType.IncomingResponseStatus;
  statusCode: number;
  statusMessage?: string;
} | {
  type: NetworkEventType.IncomingResponseData;
  payload: string;
} | {
  type: NetworkEventType.IncomingResponseHeaders;
  headers: Record<string, string | string[] | number | undefined>;
}) & {
  id: string;
}

export enum NetworkEventType {
  IncomingRequest = 'IncomingRequest',
  IncomingData = 'IncomingData',
  IncomingResponseStatus = 'IncomingResponseStatus',
  IncomingResponseData = 'IncomingResponseData',
  IncomingResponseHeaders = 'IncomingResponseHeaders',
}