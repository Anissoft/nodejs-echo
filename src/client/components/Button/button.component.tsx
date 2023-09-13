import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
  forwardRef,
} from 'react';

import { cls } from '../../../utils/classname';
import * as classes from './button.module.css';

export type ButtonProps = PropsWithChildren<
  Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'ref'
  >
>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Btton(
  { children, className, ...props },
  ref
) {
  return (
    <button ref={ref} className={cls(classes.button, className)} {...props}>
      {children}
    </button>
  );
});
