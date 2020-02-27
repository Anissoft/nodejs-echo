import React from 'react';
import { render } from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider, createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';

import getTheme from './theme';
import DataFeed from './socket';
import App from './App/App';

const generateClassName = createGenerateClassName({
  disableGlobal: false,
  productionPrefix: 'nje-',
});

const jss = create({ ...jssPreset() });

if (!localStorage.getItem('nodejs-echo-color')) {
  localStorage.setItem('nodejs-echo-color', 'dark');
}
const isDark = localStorage.getItem('nodejs-echo-color') === 'dark';

const Root = ({}) => {
  const [dark, setDark] = React.useState(isDark);
  const theme = getTheme({ dark });
  const feed = React.useRef(
    new DataFeed({
      port: +window.location.port + 1,
      secret: '',
    }),
  );

  React.useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  });

  return (
    <ThemeProvider theme={theme}>
      <App
        feed={feed.current}
        toggleTheme={() => {
          setDark(c => !c);
        }}
      />
    </ThemeProvider>
  );
};

render(
  <CssBaseline>
    <StylesProvider generateClassName={generateClassName} jss={jss}>
      <Root />
    </StylesProvider>
  </CssBaseline>,
  document.getElementById('main'),
);
