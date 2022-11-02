import React, { DetailedHTMLProps, PropsWithChildren, ButtonHTMLAttributes } from 'react';
import { cls } from '../../../utils/classname';
import classes from './button.module.css';

export type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<
    ButtonHTMLAttributes<
      HTMLButtonElement
    >, 
    HTMLButtonElement
  >
>;

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={cls(classes.button, className)} {...props}>
      {children}
    </button>
  );
};
