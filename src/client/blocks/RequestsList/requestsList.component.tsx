import React, { useCallback, useState } from 'react';
import { useClearRequestsEvent } from '../../services/requests/requests.events';
import { MessageListener, useRequests } from '../../services/requests/requests.provider';
import { Merge, NetworkEvent } from '../../../types';
import { mergeDeep } from '../../../utils/json';

type RequestItem = Partial<Omit<Merge<NetworkEvent>, 'type'>>;

export function RequestsList() {
  const [items, setItems] = useState<RequestItem[]>([]);

  useClearRequestsEvent(useCallback(()=> {
    setItems([]);
  }, []));

  const onMessage = useCallback<MessageListener>((message) => {
    setItems(prevItems => {
      for (let index = prevItems.length - 1; index >= 0; index = index -1) {
        if (prevItems[index].id === message.id) {
          prevItems[index] = mergeDeep(prevItems[index], message);
          return [...prevItems];
        }
      }

      prevItems.push(message);

      return [...prevItems]
    })
  }, []);

  useRequests(onMessage);

  console.log(items);

  return null;
}