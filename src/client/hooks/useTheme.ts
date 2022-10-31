import { useEffect } from 'react';
import { useLocalStorage } from '@anissoft/react-hooks/lib/useStorage';
import styles from '../theme.module.css';

const defaultTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

export function useTheme() {
  return useLocalStorage('theme', defaultTheme);
}

export function useThemeChange() {
  const [theme] = useTheme();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add(styles.light);
    } else {
      document.documentElement.classList.remove(styles.light);
    }
  }, [theme]);
}
