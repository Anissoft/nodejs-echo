import {
  useCustomEventListener,
  useDispatchCustomEvent,
} from '@anissoft/react-events';
import { useCallback } from 'react';

enum RequestsEvents {
  clearAllCapturedRequests = 'clearAllCapturedRequests',
  filterCapturedRequests = 'filterCapturedRequests',
}

export function useClearRequestsEvent(listener?: () => void) {
  useCustomEventListener(
    RequestsEvents.clearAllCapturedRequests,
    listener ?? (() => undefined)
  );
  const dispatch =
    useDispatchCustomEvent<RequestsEvents.clearAllCapturedRequests>();

  return useCallback(() => {
    dispatch(RequestsEvents.clearAllCapturedRequests, undefined);
  }, []);
}

export function useFilterRequestsEvent(listener?: (filter: string) => void) {
  useCustomEventListener(
    RequestsEvents.filterCapturedRequests,
    listener ?? (() => undefined)
  );
  const dispatch =
    useDispatchCustomEvent<RequestsEvents.filterCapturedRequests>();

  return useCallback((filter: string) => {
    dispatch(RequestsEvents.filterCapturedRequests, filter);
  }, []);
}
