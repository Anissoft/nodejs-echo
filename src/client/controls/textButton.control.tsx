import React, { memo } from 'react';
import { cls } from '../../utils/classname';
import { Button, ButtonProps } from '../components/Button/button.component';
import classes from './controls.module.css';

export type TextButtonProps = {
} & ButtonProps;

export const TextButton = memo(({ children, className, ...props }: TextButtonProps) => {
  return (
    <Button className={ cls(classes.button,  classes['button-t'], className)} {...props} >
      {children}
    </Button>
  );
})