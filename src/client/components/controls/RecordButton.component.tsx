import React from 'react';
import { IconButton, IconButtonProps } from './IconButton/iconButton.component';
import classes from './controls.module.css';

export type RecordButtonProps = {
  active: boolean;
} & IconButtonProps;

export function RecordButton({ children, active, ...props }: RecordButtonProps) {
  const className = `${classes['record-i']} ${active ? classes.active : ''}`;
  const title = active ? 'Stop recording' : 'Start recording'; 
  
  return (
    <IconButton {...props}  title={title}>
      <div className={className}/>
    </IconButton>
  );
}