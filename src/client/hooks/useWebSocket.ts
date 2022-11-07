import { useCallback, useEffect, useRef, useState } from 'react';
import { stringifySafe } from '../../utils/json';

const POLLING_INTERVAL = 500; // ms

export function useWebSocket(
  url: string,
  onMessage?: (event: MessageEvent<any>) => void,
  onError?: (error: MessageEvent<any> | Event | CloseEvent) => void,
) {
  const socketRef = useRef<WebSocket | null>();
  const [connected, setConnected] = useState(false);

  const connect = useCallback((address: string) => {
    if (socketRef.current != null) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(address);
    socketRef.current.addEventListener('open', () => {
      setConnected(true);
    });
    socketRef.current.addEventListener('close', () => {
      setConnected(false);
    });
  }, []);

  useEffect(() => {
    connect(url);

    const interval = setInterval(() => {
      if (
        socketRef.current != null &&
        [socketRef.current.CLOSED, socketRef.current.CLOSING].includes(
          socketRef.current?.readyState,
        )
      ) {
        connect(url);
      }
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(interval);
      socketRef.current?.close();
    };
  }, [url]);

  useEffect(() => {
    if (connected && socketRef.current != null) {
      if (onMessage != null) {
        socketRef.current.addEventListener('message', onMessage);
      }
      if (onError != null) {
        socketRef.current.addEventListener('error', onError);
      }
    }

    return () => {
      if (onMessage != null) {
        socketRef.current?.removeEventListener('message', onMessage);
      }
      if (onError != null) {
        socketRef.current?.removeEventListener('error', onError);
      }
    };
  }, [connected, onMessage, onError]);

  const send = useCallback(
    (message: object) => {
      if (connected && socketRef.current != null) {
        socketRef.current.send(stringifySafe(message));
      }
    },
    [connected],
  );

  return [connected, send] as const;
}
