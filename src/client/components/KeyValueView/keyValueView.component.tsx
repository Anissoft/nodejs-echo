import React, { memo } from 'react';

import { cls } from '../../../utils/classname';

import * as classes from './keyValueView.module.css'

export type KeyValueViewProps = {
  values: Record<string, undefined | string | number | string[]>;
  className?: string;
}

export const KeyValueView = memo(({ className, values }: KeyValueViewProps) => {
  return (
    <ul className={cls(classes.root, className)}>
      {Object.entries(values)
        .sort(([key1], [key2]) => key1 > key2 ? 1 : -1 )
        .reduce((acc, [key, value]) => {
          if (typeof value === 'string') {
            acc.push([key, value]);
          } else if (Array.isArray(value)) {
            value.forEach(subVal => {
              acc.push([key, subVal]);
            });
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([_, subVal]) => {
              acc.push([key, subVal as string]);
            });
          }
          return acc;
        }, [] as [string, undefined | string | number ][])
        .map(([key, value], index) => (
          <li key={`${key}_${index}`}>
            <span className={classes.key}>{key}:&nbsp;&nbsp;</span>
            <span className={classes.value}>{value}</span>
          </li>
        ))
      }
    </ul>
  );
})