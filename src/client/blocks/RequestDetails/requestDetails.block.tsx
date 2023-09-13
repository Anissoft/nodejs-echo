import { Case, Switch } from '@anissoft/react-conditions';
import React, { memo, useMemo, useState } from 'react';

import { RequestItem } from '../../../types';
import { cls } from '../../../utils/classname';
import { Header } from '../../components/Header/header.component';
import { KeyValueView } from '../../components/KeyValueView/keyValueView.component';
import { PayloadView } from '../../components/PayloadView/payloadView.component';
import { CloseButton } from '../../controls/closeButton.control';
import { TextButton } from '../../controls/textButton.control';
import * as classes from './requestDetails.module.css';

export interface RequestDetailsProps {
  request: RequestItem;
  onClose: () => void;
}

export const RequestDetails = memo(function RequestDetails({
  request: data,
  onClose,
}: RequestDetailsProps) {
  const [tab, setTab] = useState<'headers' | 'request' | 'response'>('headers');
  const generalData = useMemo(
    () => ({
      'Request URL': data.url,
      'Request Method': data.method,
      'Status Code': `${
        data.statusCode ? (data.statusCode > 299 ? '🔴' : '🟢') : ''
      } ${data.statusCode ?? ''} ${data.statusMessage?.toUpperCase() ?? ''}`,
    }),
    [data]
  );

  return (
    <div className={classes.root}>
      <Header className={classes.header}>
        <CloseButton onClick={onClose} />
        <TextButton
          className={cls({ [classes.active]: tab === 'headers' })}
          onClick={() => setTab('headers')}
        >
          Headers
        </TextButton>
        <TextButton
          className={cls({ [classes.active]: tab === 'request' })}
          onClick={() => setTab('request')}
        >
          Request
        </TextButton>
        <TextButton
          className={cls({ [classes.active]: tab === 'response' })}
          onClick={() => setTab('response')}
        >
          Response
        </TextButton>
      </Header>
      <div className={classes.container}>
        <Switch>
          <Case condition={tab === 'headers'}>
            <Header className={classes['segment-header']}>[General]</Header>
            <KeyValueView values={generalData} />
            <Header className={classes['segment-header']}>
              [Request headers]
            </Header>
            {data.requestHeaders != null && (
              <KeyValueView values={data.requestHeaders} />
            )}
            <Header className={classes['segment-header']}>
              [Response headers]
            </Header>
            {data.responseHeaders != null && (
              <KeyValueView values={data.responseHeaders} />
            )}
          </Case>
          <Case condition={tab === 'request'}>
            <PayloadView
              data={data.request}
              contentType={data.requestHeaders?.['content-type']}
            />
          </Case>
          <Case condition={tab === 'response'}>
            <PayloadView
              data={data.response}
              contentType={data.responseHeaders?.['content-type']}
            />
          </Case>
        </Switch>
      </div>
    </div>
  );
});
