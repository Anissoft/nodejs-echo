import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export default createMuiTheme({
  typography: {
    fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#42c73b',
    },
  },
});
