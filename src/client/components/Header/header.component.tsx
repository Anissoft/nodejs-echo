import React, { PropsWithChildren } from 'react';

import { cls } from '../../../utils/classname';
import * as classes from './header.module.css';

export type HeaderProps = PropsWithChildren<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
>;

export const Header = ({ children, className, ...props }: HeaderProps) => {
  return (
    <header className={cls(classes.root, className)} {...props}>
      {children}
    </header>
  );
};
