import React, { memo, useState } from 'react';
import { CloseButton } from '../../controls/closeButton.control';
import { RequestItem } from '../../../types';

import { TextButton } from '../../controls';
import { Header } from '../../components/Header/header.component';
import { cls } from '../../../utils/classname';

import classes from './requestDetails.module.css';
import { KeyValueView } from '../../components/KeyValueView/keyValueView.component';

export type RequestDetailsProps = {
  request: RequestItem;
  onClose: () => void;
}

export const RequestDetails = memo(({ request, onClose }: RequestDetailsProps) => {
  const [tab, setTab] = useState<0 | 1 | 2>(0);
  return (
    <div className={classes.root}>
      <Header className={classes.header}>
        <CloseButton onClick={onClose}/>
        <TextButton className={cls({[classes.active]: tab === 0})} onClick={() => setTab(0)}>
          Headers
        </TextButton>
        <TextButton className={cls({[classes.active]: tab === 1})} onClick={() => setTab(1)}>
          Request
        </TextButton>
        <TextButton className={cls({[classes.active]: tab === 2})} onClick={() => setTab(2)}>
          Response
        </TextButton>
      </Header>
      {tab === 0 && (
        <div>
          <Header className={classes['segment-header']}>
            [Request headers]
          </Header>
          {request.requestHeaders && (
            <KeyValueView values={request.requestHeaders}/>
          )}
          <Header className={classes['segment-header']}>
            [Response headers]
          </Header>
          {request.responseHeaders && (
            <KeyValueView values={request.responseHeaders}/>
          )}
        </div>
        )}
    </div>
  );
});
