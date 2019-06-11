import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    maxWidth: 600,
    minWidth: 250,
    width: '33.3%',
    marginTop: 6,
    marginBottom: 6,
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  label: {
    marginTop: -5,
  },
  labelShrink: {
    marginTop: 0,
  }
}));
