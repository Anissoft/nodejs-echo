import React, { PropsWithChildren } from 'react';

import { cls } from '../../../utils/classname';

import classes from './header.module.css';

export type HeaderProps = PropsWithChildren<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
>

export function Header({children, className, ...props}: HeaderProps) {
  return (
    <header className={cls(classes.root, className)} {...props}>
      {children}
    </header>
  );
}
