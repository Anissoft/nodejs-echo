import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    minHeight: 'calc(100vh - 49px)',
    // position: 'absolute',
    marginBottom: 49,
  },
  row: {
    height: 40,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  statusGreen: {
    color: theme.palette.secondary.main
  },
  statusYellow: {
    color: '#ddd73e'
  },
  statusRed: {
    color: '#ec1616'
  },
}));
