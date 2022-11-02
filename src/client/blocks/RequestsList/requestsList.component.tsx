import React, { memo, useCallback, useMemo, useState } from 'react';

import { useClearRequestsEvent } from '../../services/requests/requests.events';
import { SplitView } from '../../components/layouts/SplitView/splitView.component';
import { RequestDetails } from '../RequestDetails/requestDetails.component';
import { TableView, TableViewColumn } from '../../components/layouts/TableView/tableview.component';
import { MessageListener, useRequests } from '../../services/requests/requests.provider';

import { mergeDeep } from '../../../utils/json';
import {  RequestItem } from '../../../types';

import classes from './requestsList.module.css';

export const RequestsList = memo(() => {
  const [open, setOpen] = useState<RequestItem | null>(null);
  const [items, setItems] = useState<RequestItem[]>([]);
  const columns = useMemo<TableViewColumn<RequestItem>[]>(() => [{
    title: 'Time',
    key: 'timeStart',
    getValue(item) {
      const timestamptWithOffset = item.timeStart! - new Date().getTimezoneOffset() * 60 * 1000;
      const [_, match] =  new Date(timestamptWithOffset).toISOString().match(/T(.+)Z/) || [];
      return match;
    }
  }, {
    title: '⎈',
    key: 'incoming',
    align: 'center',
    sortable: false,
    getValue(item) {
      return item.incoming ? '↘️' : '↖️'
    }
  }, {
    title: 'Method',
    key: 'method',
    align: 'center',
  }, {
    title: 'Address',
    key: 'url',
    width: '100%',
    getValue(item) {
      if (item.incoming && item.requestHeaders?.host) {
        return item.url!.replace(/:\/\/[\-\_a-z0-9\.\:]*/, `://${item.requestHeaders?.host}`);
      }
      return item.url!;
    }
  }, {
    title: 'Status',
    key: 'statusCode',
    align: 'center',
  }, {
    title: 'Duration',
    align: 'left',
    key: 'timeEnd',
    getValue(item) {
      return (item.timeEnd && item.timeStart) ? `${item.timeEnd - item.timeStart}ms` : ''
    }
  }], []);

  const getItemId = useCallback((item: RequestItem) => item.id!, [])

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
  useClearRequestsEvent(useCallback(()=> {
    setItems([]);
    setOpen(null);
  }, []));

  const onItemClick = useCallback((item: RequestItem) => {
    console.log(item);
    setOpen(item);
  }, []);

  return (
    <div className={classes.root}>
       <SplitView name='requests' threshold='(max-width: 1024px)'>
        <div className={classes.container}>
          <TableView 
            items={items}
            selectedId={open?.id}
            columns={columns}
            getId={getItemId}
            onRowClick={onItemClick}
          />
        </div>
        {open && <RequestDetails request={open} />}
      </SplitView>
    </div>
  );
});
