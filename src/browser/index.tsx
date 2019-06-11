import * as React from 'react';
import { render } from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Play from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import useRefFor from '@anissoft/react-helpers/hooks/useRefFor'
import If from '@anissoft/react-helpers/components/If';
// import Freeze from '@anissoft/react-helpers/components/Freeze';

import { List } from './List'
import { AppBar } from './AppBar'
import { FilterFiled as _FilterFiled } from './Filter';
import theme from './theme';
import { useSocket } from './useSocket';

const container = document.createElement('div');
container.id = 'app-root';
document.body.appendChild(container);

const Main = () => {
  const { socket, addSocketListener } = useSocket({
    port: +location.port + 1
  });

  const [ref, FilterFiled] = useRefFor(_FilterFiled);
  const [status, setStatus] = React.useState(true);
  const filter = ref && ref.current && ref.current.value as string || '';

  return (
    <>
      <List {...{ addSocketListener, filter, enabled: status }} />
      <AppBar pending={!socket && status}>
        <FilterFiled />
        <IconButton
          onClick={() => setStatus(prev => !prev)}
        >
          <If
            condition={status}
            then={() => <Stop />}
            else={() => <Play />}
          />
        </IconButton>
      </AppBar>
    </>
  )
};

render(
  <CssBaseline>
    <ThemeProvider theme={theme} >
      <Main />
    </ThemeProvider>
  </CssBaseline>,
  document.getElementById('app-root'),
);
