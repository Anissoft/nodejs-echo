import React, { memo } from 'react';
import { cls } from '../../../utils/classname';

import classes from './keyValueView.module.css'

export type KeyValueViewProps = {
  values: Record<string, undefined | string | number | string[]>;
  className?: string;
}

export const KeyValueView = memo(({ className, values }: KeyValueViewProps) => {
  return (
    <ul className={cls(classes.root, className)}>
      {Object.entries(values).sort(([key1], [key2]) => key1 > key2 ? 1 : -1 ).map(([key, value]) => (
        <li>
          <span className={classes.key}>{key}:&nbsp;&nbsp;</span>
          <span className={classes.value}>{value}</span>
        </li>
      ))}
    </ul>
  );
})