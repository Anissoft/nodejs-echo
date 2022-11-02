import React, { memo } from 'react';
import { Button, ButtonProps } from '../components/Button/button.component';
import { cls } from '../../utils/classname';

import classes from './controls.module.css';

export type RecordButtonProps = {
  active: boolean;
} & ButtonProps;

export const RecordButton = memo(({ children, active, ...props }: RecordButtonProps) => {
  const title = active ? 'Stop recording' : 'Start recording'; 
  
  return (
    <Button className={cls(classes.button, classes['button-i'])} title={title} {...props} >
      <div className={cls(classes['record-i'], { [classes.active]: active })}/>
    </Button>
  );
})