import * as React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

// import IconButton from '@material-ui/core/IconButton';
// import Paper from '@material-ui/core/Paper';
// import Fab from '@material-ui/core/Fab';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import Avatar from '@material-ui/core/Avatar';
// import MenuIcon from '@material-ui/icons/Menu';
// import AddIcon from '@material-ui/icons/Add';
// import SearchIcon from '@material-ui/icons/Search';
// import MoreIcon from '@material-ui/icons/MoreVert';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';

import useStyles from './styles';
import If from '@anissoft/react-helpers/components/If';

export const AppBar = ({
  connected,
}: {
  connected: boolean;
}) => {
  const classes = useStyles();

  return (
    <MuiAppBar position="fixed" color="secondary" className={classes.appBar}>
      <If condition={!connected}>
        <LinearProgress color="secondary" />
      </If>
      <Toolbar className={classes.toolbar} variant="dense">
        <Typography>
          NodeJS Echo
        </Typography>
        <If
          condition={connected}
          then={() => <Wifi />}
          else={() => <WifiOff />}
        />
        {/* <IconButton color="inherit" aria-label="Open drawer">
          <MenuIcon />
        </IconButton>
        <Fab color="secondary" aria-label="Add" className={classes.fabButton}>
          <AddIcon />
        </Fab>
        <div>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton>
        </div> */}
      </Toolbar>
    </MuiAppBar>
  );
}
