import { useCallback } from 'react';
import { useCustomEventListener, useDispatchCustomEvent } from '@anissoft/react-events';

enum RequestsEvents {
  clearAllCapturedRequests = 'clearAllCapturedRequests'
}

export function useClearRequestsEvent(listener?: () => void) {
  useCustomEventListener(RequestsEvents.clearAllCapturedRequests, listener ?? (() => undefined));
  const dispatch = useDispatchCustomEvent<RequestsEvents.clearAllCapturedRequests>();

  return useCallback(() => {
    dispatch(RequestsEvents.clearAllCapturedRequests, undefined);
  }, []);
}