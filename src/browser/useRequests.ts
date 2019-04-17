import * as React from 'react';
import { WSListener, Request, Response } from '../../types';
import { useSocket } from './useSocket';

export const useRequests = ({
  addSocketListener
}: {
  addSocketListener: (arg0: WSListener) => (() => void)
}) => {
  const [requests, setRequests] = React.useState({} as { [key: string]: Request })
  const [responses, setResponses] = React.useState({} as { [key: string]: Response })
  const [times, setTimes] = React.useState({} as { [key: string]: number })

  React.useEffect(
    () => addSocketListener((event) => {
      const message = event.data;
      try {
        const json: Response | Request = JSON.parse(message);
        if (Object.prototype.hasOwnProperty.call(json, 'request')) {
          setTimeout(() => {
            setTimes(state => Object.assign({}, state, { [json.id]: Date.now() }));
            setRequests(state => Object.assign({}, state, { [json.id]: json }));
          }, 0);
        }
        if (Object.prototype.hasOwnProperty.call(json, 'response')) {
          try {
            const jsonData = JSON.parse((json as Response).response.data as string);
            ((json as Response).response.data as any) = jsonData;
            setTimeout(() => {
              setResponses(state => Object.assign({}, state, { [json.id]: json }))
            }, 0);
          } catch (e) {
            setTimeout(() => {
              setResponses(state => Object.assign({}, state, { [json.id]: json }))
            }, 0);
          }
        }
      } catch (e) {
        console.info(message);
      }
    }),
    [],
  )

  return [requests, responses, times] as [{
    [key: string]: Request;
  }, {
    [key: string]: Response;
  }, {
    [key: string]: number;
  }];
}
