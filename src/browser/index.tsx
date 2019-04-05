import * as React from 'react';
import { render } from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import { List } from './List'
import { AppBar } from './AppBar'
import theme from './theme';

const container = document.createElement('div');
container.id = 'app-root';
document.body.appendChild(container);

render(
  <CssBaseline>
    <ThemeProvider theme={theme} >
      <div style={{ flexGrow: 1 }}>
        <AppBar />
      </div>
      <List />
    </ThemeProvider>
  </CssBaseline>,
  document.getElementById('app-root'),
);
