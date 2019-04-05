import * as React from 'react';

import useStyles from './styles';

export const List = () => {
  const classes = useStyles();
  const [connected, setConnected] = React.useState(false);
  React.useEffect(
    () => {
      let interval: any;
      let socket: any;
      if (connected) {
        socket = new WebSocket(`ws://${location.hostname}:${+location.port + 1}`);
        socket.onmessage = (event: any) => console.log("Получены данные " + event.data);
        socket.onopen = () => { socket.send('hello') };
        socket.onclose = () => { setConnected(false); }
        socket.onerror = (error: any) => {
          console.log(`Ошибка ${(error as any).message}`);
          setConnected(false);
        };
      } else {
        interval = setInterval(() => {
          socket = new WebSocket(`ws://${location.hostname}:${+location.port + 1}`);
          socket.onopen = () => { setConnected(true); };
          socket.onerror = (error: any) => {
            console.log(`Нет соединения ${(error as any).message}`);
            socket.close();
          };
        }, 1000)
      }

      return () => { console.log('effect callbak'); clearInterval(interval); socket.close(); }
    },
    [connected],
  )

  return null;
}
