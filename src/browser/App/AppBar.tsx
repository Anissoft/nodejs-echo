import React from 'react';
import { useBox } from '@anissoft/box';
import { If, ElseIf, Then, Else } from '@anissoft/react-helpers/components/If';
import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Dark from '@material-ui/icons/Brightness4';
import Bright from '@material-ui/icons/Brightness7';
import SearchIcon from '@material-ui/icons/Search';
import DeleteSweep from '@material-ui/icons/DeleteSweep';
import Pause from '@material-ui/icons/Pause';
import Play from '@material-ui/icons/PlayArrow';

import useStyles from './styles';

export default ({
  connected,
  pause,
  onChangeFilter,
  onClear,
  onPause,
}: {
  connected: boolean;
  pause: boolean;
  onChangeFilter: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onClear?: () => void;
  onPause?: () => void;
}) => {
  const classes = useStyles({});

  const toggleTheme = () => {
    localStorage.setItem(
      'nodejs-echo-color',
      localStorage.getItem('nodejs-echo-color') === 'dark' ? 'light' : 'dark',
    );
    window.location.reload();
  };

  return (
    <>
      <AppBar position="static">
        <If condition={!connected}>
          <LinearProgress style={{ position: 'fixed' }} />
        </If>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} onClick={toggleTheme}>
            <If condition={localStorage.getItem('nodejs-echo-color') === 'dark'}>
              <Then>
                <Dark />
              </Then>
              <Else>
                <Bright />
              </Else>
            </If>
          </IconButton>
          <IconButton edge="start" className={classes.menuButton} onClick={onClear}>
            <DeleteSweep />
          </IconButton>
          <IconButton edge="start" className={classes.menuButton} onClick={onPause}>
            <If condition={pause}>
              <Then>
                <Play />
              </Then>
              <Else>
                <Pause />
              </Else>
            </If>
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit"></Typography>
          <div className={classes.search}>
            <InputBase
              placeholder="Filter…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              type="text"
              name="filter"
              onChange={onChangeFilter}
              disabled={!connected}
              autoComplete={`${Date.now()}`}
            />
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};
