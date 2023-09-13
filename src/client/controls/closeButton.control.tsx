import React, { memo } from 'react';

import { cls } from '../../utils/classname';
import { Button, ButtonProps } from '../components/Button/button.component';
import * as classes from './controls.module.css';

export type CloseButtonProps = {} & ButtonProps;

export const CloseButton = memo(function CloseButton({
  children,
  ...props
}: CloseButtonProps) {
  return (
    <Button
      className={cls(classes.button, classes['button-i'])}
      title={'Close'}
      {...props}
    >
      <div className={classes['close-i']}>✕</div>
    </Button>
  );
});
