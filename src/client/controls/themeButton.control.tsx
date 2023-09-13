import React, { forwardRef, memo, useCallback } from 'react';

import { cls } from '../../utils/classname';
import { Button, ButtonProps } from '../components/Button/button.component';
import { useTheme } from '../hooks/useTheme';
import * as classes from './controls.module.css';

export type ThemeButtonProps = ButtonProps;

export const ThemeButton = memo(
  forwardRef<HTMLButtonElement, ThemeButtonProps>(function ThemeButton(
    { children, onClick, ...props },
    ref
  ) {
    const [theme, setTheme] = useTheme();
    const title = theme === 'light' ? 'Enable dark mode' : 'Enable light mode';

    const onToggleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setTheme((v) => (v === 'light' ? 'dark' : 'light'));

        if (onClick) {
          onClick(event);
        }
      },
      [setTheme, onClick]
    );

    return (
      <Button
        ref={ref}
        className={cls(classes.button, classes['button-i'])}
        title={title}
        {...props}
        onClick={onToggleClick}
      >
        <div className={cls(classes['theme-i'])}>☼</div>
      </Button>
    );
  })
);
