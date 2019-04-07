import * as React from 'react';
import { WSListener } from '../../types';

export const useSocket = (props: { port: string | number, parrphrase: string }) => {
  const [socket, saveSocket] = React.useState(null) as [WebSocket | null, React.Dispatch<React.SetStateAction<WebSocket | null>>];
  const [listeners, setListeners] = React.useState([] as WSListener[]);

  const addSocketListener: (arg0: WSListener) => (() => void) = (listener) => {
    setListeners([...listeners, listener]);
    const index = listeners.length - 1;
    return () => delete listeners[index];
  }

  React.useEffect(
    () => {
      let interval: any;
      if (socket) {
        // socket = new WebSocket(`ws://${location.hostname}:${+location.port + 1}`);
        socket.onmessage = (event: any) => {
          listeners.forEach(listener => {
            try {
              if (listener) {
                listener(event);
              }
            } catch (e) {
              console.error(e);
            }
          })
        }
        socket.send(`${props.parrphrase}`);
        socket.onclose = () => { saveSocket(null); }
        socket.onerror = (error: any) => {
          console.info('Lost connection');
          socket.close();
          saveSocket(null);
        };
      } else {
        interval = setInterval(() => {
          try {
            const candidate = new WebSocket(`ws://${location.hostname}:${+props.port}`);
            candidate.onopen = () => { clearInterval(interval); saveSocket(candidate); };
            candidate.onerror = (error: any) => {
              candidate.close();
            };
          } catch (e) {

          }
        }, 1000)
      }

      return () => { clearInterval(interval); }
    },
    [socket],
  )

  return {
    socket,
    addSocketListener,
  };
}
