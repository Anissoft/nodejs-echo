import * as React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import If from '@anissoft/react-helpers/components/If';

import useStyles from './styles';

export const AppBar = ({
  pending,
  children,
}: {
  pending: boolean;
  children?: React.ReactNode;
}) => {
  const classes = useStyles({});

  return (
    <MuiAppBar
      position="fixed"
      color="secondary"
      className={classes.appBar}
    >
      <If condition={pending}>
        <LinearProgress color="secondary" />
      </If>
      <Toolbar
        className={classes.toolbar}
        variant="dense"
      >
        {children}
        {/* <FilterFiled />
        <If
          condition={connected}
          then={() => <Wifi />}
          else={() => <WifiOff />}
        /> */}
      </Toolbar>
    </MuiAppBar>
  );
}
