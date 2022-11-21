import React, { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';

import { ThemeButton } from '../../controls/themeButton.control';
import { ClearButton } from '../../controls/clearButton.control';
import { RecordButton } from '../../controls/recordButton.control';
import { TextInput } from '../../components/TextInput/textInput.component';
import { Header as BaseHeader } from '../../components/Header/header.component';
import { useRequests } from '../../services/requests/requests.provider';
import {
  useClearRequestsEvent,
  useFilterRequestsEvent,
} from '../../services/requests/requests.events';

import * as classes from './header.module.css';

export const Header = memo(function Header() {
  const recButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<'offline' | 'online' | 'error'>('offline');
  const [isConnected, isEnabled, setEnabled] = useRequests(
    useCallback(() => {
      if (recButtonRef.current == null) {
        return;
      }

      recButtonRef.current.classList.add(classes.blink);

      setTimeout(() => {
        recButtonRef.current?.classList.remove(classes.blink);
      }, 500);
    }, []),
    useCallback(() => setStatus('error'), []),
  );

  const clearAllCapturedRequests = useClearRequestsEvent();
  const filterCapturedRequests = useFilterRequestsEvent();

  useEffect(() => {
    setStatus(isConnected ? 'online' : 'offline');
  }, [isConnected]);

  const onRecordToggle = useCallback(() => setEnabled((val) => !val), [setEnabled]);

  const onFilterChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    filterCapturedRequests(event.target.value);
  }, []);

  return (
    <BaseHeader className={classes.root}>
      <div className={classes.controls}>
        <RecordButton
          ref={recButtonRef}
          disabled={!isConnected}
          active={isConnected && isEnabled}
          onClick={onRecordToggle}
        />
        <ClearButton onClick={clearAllCapturedRequests} />
        <ThemeButton />
      </div>
      <TextInput
        type="search"
        className={classes.filter}
        placeholder="Filter"
        onChange={onFilterChange}
      />
      <div className={classes.status}>{status}</div>
    </BaseHeader>
  );
});
