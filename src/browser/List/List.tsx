import * as React from 'react';

import useStyles from './styles';
import { useSocket } from '../useSocket';

export const List = () => {
  const classes = useStyles();
  const [requests, setRequests] = React.useState({} as { [key: string]: Request })
  const { addSocketListener } = useSocket({
    port: +location.port + 1,
    parrphrase: 'hello'
  });

  React.useEffect(
    () => addSocketListener((event) => {
      console.log(JSON.parse(event.data));
    }),
    [],
  )

  return null;
}
