import React, { memo, useCallback, useEffect, useState } from 'react';

import { Header as BaseHeader } from '../../components/Header/header.component';
import { RecordButton } from '../../controls/recordButton.control';
import { ClearButton } from '../../controls/clearButton.control';
import { useRequests } from '../../services/requests/requests.provider';
import { useClearRequestsEvent } from '../../services/requests/requests.events';

import classes from './header.module.css'

export const Header = memo(() => {
  const [status, setStatus] = useState<'offline' | 'online' | 'error'>('offline');
  const [isConnected, isEnabled, setEnabled] = useRequests(undefined, () => setStatus('error'));
  const clearAllCapturedRequests = useClearRequestsEvent();

  useEffect(() => {
    setStatus(isConnected ? 'online' : 'offline');
  }, [isConnected]);

  const onRecordToggle = useCallback(
    () => setEnabled(val => !val),
    [setEnabled],
  );

  return (
    <BaseHeader className={classes.root}>
      <div className={classes.controls}>
        <RecordButton disabled={!isConnected} active={isEnabled} onClick={onRecordToggle} />
        <ClearButton onClick={clearAllCapturedRequests}/>
      </div>
      <div className={classes.filter}>
        {'{{Filter}}'}
      </div>
      <div className={classes.status}>{status}</div>
    </BaseHeader>
  )
});
