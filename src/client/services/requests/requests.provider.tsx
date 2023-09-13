import { useSet } from '@anissoft/react-hooks';
import { useQueryStringParameter } from '@anissoft/react-hooks/lib/useQueryParameters';
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { NetworkEvent } from '../../../types';
import { useWebSocket } from '../../hooks/useWebSocket';

const RequestsContext = createContext<{
  readonly connected: boolean;
  readonly enabled: boolean;
  readonly setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  readonly addListener: (listener: MessageListener) => void;
  readonly removeListener: (listener: MessageListener) => void;
  readonly addErrorListener: (listener: ErrorListener) => void;
  readonly removeErrorListener: (listener: ErrorListener) => void;
}>(undefined as unknown as any);

export type MessageListener = (event: NetworkEvent) => void;
export type ErrorListener = (
  event: MessageEvent<any> | Event | CloseEvent
) => void;

export enum requestsEvents {
  clearAllCapturedRequests = 'clearAllCapturedRequests',
}
export function RequestsProvider({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(true);
  const [socketPort] = useQueryStringParameter(
    'socket',
    (+location.host.split(':')[1] + 1).toString()
  );
  const socketAddress = `ws://${window.location.hostname}:${socketPort ?? ''}`;
  const messageListeners = useSet<MessageListener>([]);
  const errorListeners = useSet<ErrorListener>([]);

  const onMessage = useCallback(
    (event: MessageEvent<any>) => {
      if (!enabled) {
        return;
      }

      const payload = JSON.parse(event.data) as NetworkEvent;

      messageListeners.forEach((listener) => {
        try {
          listener.call(window, payload);
        } catch (error) {
          console.error(`Failed to execute listener - ${listener.name}`, error);
        }
      });
    },
    [messageListeners, enabled]
  );

  const onError = useCallback(
    (event: MessageEvent<any> | Event | CloseEvent) => {
      if (!enabled) {
        return;
      }

      errorListeners.forEach((listener) => {
        try {
          listener.call(window, event);
        } catch (error) {
          console.error(
            `Failed to execute error listener - ${listener.name}`,
            error
          );
        }
      });
    },
    [errorListeners, enabled]
  );

  const [connected] = useWebSocket(socketAddress, onMessage, onError);

  const requests = useMemo(
    () =>
      ({
        connected,
        enabled,
        setEnabled,
        addListener: messageListeners.add,
        removeListener: messageListeners.delete,
        addErrorListener: errorListeners.add,
        removeErrorListener: errorListeners.delete,
      } as const),
    [connected, enabled]
  );

  return (
    <RequestsContext.Provider value={requests}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests(
  onMessage?: MessageListener,
  onError?: ErrorListener
) {
  const requests = useContext(RequestsContext);

  useEffect(() => {
    if (onMessage == null) {
      return;
    }

    requests.addListener(onMessage);

    return () => {
      requests.removeListener(onMessage);
    };
  }, [onMessage]);

  useEffect(() => {
    if (onError == null) {
      return;
    }

    requests.addErrorListener(onError);

    return () => {
      requests.removeErrorListener(onError);
    };
  }, [onError]);

  return useMemo(() => {
    return [requests.connected, requests.enabled, requests.setEnabled] as const;
  }, [requests.connected, requests.enabled, requests.setEnabled]);
}
