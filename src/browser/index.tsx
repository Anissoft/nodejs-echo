import React from 'react';
import { render } from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider, createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';

import theme from './theme';
import DataFeed from './socket';
import App from './App/App';

const generateClassName = createGenerateClassName({
  disableGlobal: false,
  productionPrefix: 'nje-',
});

const jss = create({ ...jssPreset() });

console.log(jssPreset());

document.body.style.backgroundColor = theme.palette.background.default;
const feed = new DataFeed({
  port: +window.location.port + 1,
  secret: '',
});

render(
  <CssBaseline>
    <StylesProvider generateClassName={generateClassName} jss={jss}>
      <ThemeProvider theme={theme}>
        <App feed={feed} />
      </ThemeProvider>
    </StylesProvider>
  </CssBaseline>,
  document.getElementById('main'),
);
