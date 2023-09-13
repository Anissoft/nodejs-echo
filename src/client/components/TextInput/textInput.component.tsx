import React, { forwardRef } from 'react';

import { cls } from '../../../utils/classname';
import * as classes from './textInput.module.css';

export type TextInputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'ref'
>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className, ...props }, ref) {
    return (
      <input ref={ref} className={cls(classes.root, className)} {...props} />
    );
  }
);
