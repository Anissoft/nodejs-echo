import { useLocalStorage } from '@anissoft/react-hooks';
import React, { PropsWithChildren, memo, useCallback } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import * as classes from './splitView.module.css';

export type SplitViewProps = PropsWithChildren<{
  name: string;
  threshold?: string;
}>;

export const SplitView = memo(function SplitView({
  name,
  threshold = '(max-width: 768px)',
  children,
}: SplitViewProps) {
  const [secondaryInitialSize, setSecondaryInitialSize] = useLocalStorage(
    `initialSplitViewSecondary_${name}`,
    '50'
  );
  const isVertical = useMediaQuery(threshold);

  const onChangeProportions = useCallback((v: number) => {
    setSecondaryInitialSize(v.toString());
  }, []);

  return (
    <div className={classes.root}>
      <SplitterLayout
        percentage
        customClassName={classes.container}
        vertical={isVertical}
        onSecondaryPaneSizeChange={onChangeProportions}
        secondaryInitialSize={+(secondaryInitialSize as string)}
        primaryMinSize={20}
        secondaryMinSize={20}
      >
        {children}
      </SplitterLayout>
    </div>
  );
});
