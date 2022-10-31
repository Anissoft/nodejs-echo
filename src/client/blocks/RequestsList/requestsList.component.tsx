import React, { useCallback, useMemo, useState } from 'react';

import { SplitView } from '../../components/layouts/SplitView/splitview.component';
import { useClearRequestsEvent } from '../../services/requests/requests.events';
import { MessageListener, useRequests } from '../../services/requests/requests.provider';
import { Merge, NetworkEvent } from '../../../types';
import { mergeDeep } from '../../../utils/json';

import classes from './requestsList.module.css';

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

  return (
    <div className={classes.root}>
       <SplitView name='requests' threshold='(max-width: 768px)'>
        <div className={classes.container}>
          {/* // table */}
        </div>
          <div className={classes.details} >
            {/* // drawer */}
          </div>
      </SplitView>
    </div>
  );
}