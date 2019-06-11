import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
    minHeight: 'calc(100vh - 52px)',
    // position: 'absolute',
    marginBottom: 46,
    flexWrap: 'nowrap',
  },
  row: {
    minHeight: 40,
    flexWrap: 'nowrap',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  statusGreen: {
    color: theme.palette.secondary.main
  },
  url: {
    wordWrap: 'break-word',
    /* line-break: normal; */
    width: '100%',
  },
  statusYellow: {
    color: '#ddd73e'
  },
  statusRed: {
    color: '#ec1616'
  },
}));
