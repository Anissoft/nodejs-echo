import React, { forwardRef } from 'react';
import { cls } from '../../../utils/classname';

import classes from './textInput.module.css';

export type TextInputProps = {

} & Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'ref'
>

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({className, ...props }, ref) => {
  return (
    <input className={cls(classes.root, className)} {...props} />
  );
})