import React, { memo } from 'react';

import { cls } from '../../../utils/classname';

import * as classes from './keyValueView.module.css';

export interface KeyValueViewProps {
  values: Record<string, undefined | string | number | string[]>;
  className?: string;
}

export const KeyValueView = memo(function KeyValueView({ className, values }: KeyValueViewProps) {
  console.log({ values });
  return (
    <ul className={cls(classes.root, className)}>
      {Object.entries(values)
        .sort(([key1], [key2]) => (key1 > key2 ? 1 : -1))
        .reduce<Array<[string, undefined | string | number]>>((acc, [key, value]) => {
          console.log({ key, value }, typeof value);
          if (typeof value === 'string') {
            acc.push([key, value]);
          } else if (Array.isArray(value)) {
            value.forEach((subVal) => {
              acc.push([key, subVal]);
            });
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([_, subVal]) => {
              console.log('acc push ', subVal);
              acc.push([key, subVal as string]);
            });
          }
          return acc;
        }, [])
        .map(([key, value], index) => (
          <li key={`${key}_${index}`}>
            <span className={classes.key}>{key}:&nbsp;&nbsp;</span>
            <span className={classes.value}>{value}</span>
          </li>
        ))}
    </ul>
  );
});
