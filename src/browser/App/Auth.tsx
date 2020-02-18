import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default ({
  authorized,
  authorize,
}: {
  authorize: (secret: string) => void;
  authorized: boolean;
}) => {
  const [error, setError] = React.useState('');
  const [secret, setSecret] = React.useState('');

  const handleAuthorize = async () => {
    try {
      await authorize(secret);
    } catch (e) {
      setError('Invalid secret key');
    }
  };

  return (
    <Dialog open={!authorized} disableBackdropClick>
      <DialogTitle>Authorize</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To see to this website, please enter your secret key here:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="seret"
          label="secret key"
          type="password"
          onChange={event => {
            setSecret(event.target.value);
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              handleAuthorize();
            }
          }}
          fullWidth
          error={!!error}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!secret} onClick={handleAuthorize} color="primary">
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};
