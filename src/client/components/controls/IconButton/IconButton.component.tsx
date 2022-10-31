import React, { DetailedHTMLProps, PropsWithChildren, ButtonHTMLAttributes } from 'react';
import classes from './IconButton.module.css';

export type IconButtonProps = PropsWithChildren<
  DetailedHTMLProps<
    ButtonHTMLAttributes<
      HTMLButtonElement
    >, 
    HTMLButtonElement
  >
>;

export function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <button className={`${classes.button} ${props.className ?? ''}`} {...props}>
      {children}
    </button>
  );
}