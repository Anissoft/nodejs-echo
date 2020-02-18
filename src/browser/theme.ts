import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

if (!localStorage.getItem('nodejs-echo-color')) {
  localStorage.setItem('nodejs-echo-color', 'dark');
}

const isDark = localStorage.getItem('nodejs-echo-color') === 'dark';

export default createMuiTheme({
  typography: {
    fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
  },
  palette: {
    type: isDark ? 'dark' : 'light',
    primary: {
      main: isDark ? '#222222' : '#c7c7c7',
    },
    secondary: {
      main: '#42c73b',
    },
  },
});
