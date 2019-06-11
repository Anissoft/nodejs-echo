import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

import useStyles from './styles';

export default function FilterFIeld(props: TextFieldProps) {
  const classes = useStyles({});

  return (
    <TextField
      label="filter"
      margin="dense"
      className={classes.root}
      {...props}
      InputLabelProps={{
        classes: {
          shrink: classes.labelShrink,
          marginDense: classes.label,
        }
      }}
      inputProps={{
        className: classes.input,
        margin: 'dense',
      }}
      variant="outlined"
    />
  )
}
