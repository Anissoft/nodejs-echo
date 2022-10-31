import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Split } from '@geoffcox/react-splitter';
import { useLocalStorage } from '@anissoft/react-hooks';

import classes from './splitview.module.css';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

export type SplitViewProps = PropsWithChildren<{
  name: string;
  threshold?: string;
}>;

export function SplitView({ name, threshold = '(max-width: 768px)', children }: SplitViewProps) {
  const [initialListWidth, setInitialListWidth] = useLocalStorage(`initialListWidth_${name}`, '50%')
  const isHorizontal = useMediaQuery(threshold)

  const onChangeProportions = useCallback((v: string) => {
    setInitialListWidth(v);
  }, []);

  return (
    <div className={classes.root}>
      <Split 
        horizontal={isHorizontal}
        onSplitChanged={onChangeProportions} 
        initialPrimarySize={initialListWidth as string}
        minPrimarySize={'20%'}
        minSecondarySize={'20%'}
        splitterSize='2px'
      >
        {children}
      </Split>
    </div>
  );
}