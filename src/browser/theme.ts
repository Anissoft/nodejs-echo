import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export default ({ dark }: { dark: boolean }) =>
  createMuiTheme({
    typography: {
      fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
    },
    palette: {
      type: dark ? 'dark' : 'light',
      primary: {
        main: dark ? '#222222' : '#c7c7c7',
      },
      secondary: {
        main: dark ? '#c7c7c7' : '#222222',
      },
    },
  });
