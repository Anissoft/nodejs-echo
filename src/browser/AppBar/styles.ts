import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  dense: {
    marginTop: 16,
  },
}));
