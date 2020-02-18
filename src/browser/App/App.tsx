import React from 'react';
import { useBox } from '@anissoft/box';
import Memo from '@anissoft/react-helpers/components/Memo';

import DataFeed from '../socket';
import AppBar from './AppBar';
import Table from './Table';
import { CompleteItem } from '../../types';
import Auth from './Auth';
import Target from './Target';

export default ({ feed }: { feed: DataFeed }) => {
  const { pick } = useBox(feed);
  const connected = pick<boolean>('connected');
  const authorized = pick<boolean>('authorized');
  const [filter, setFilter] = React.useState('');
  const [pause, setPause] = React.useState(false);
  const [target, setTarget] = React.useState<CompleteItem>();
  const { merge, get, set, pick: pickRequest } = useBox<Record<string, CompleteItem>>({});
  const requests = Object.values(get());

  React.useEffect(() => {
    if (connected) {
      const unsubscribe = feed.listen(event => {
        if (pause) {
          return;
        }
        try {
          const data = JSON.parse(event.data) as Partial<CompleteItem>;
          if (!data.id || (!data.request && !pickRequest(data.id))) {
            return;
          }
          if (data.body) {
            try {
              data.body = JSON.parse(data.body);
            } catch (e) {}
          }
          if (data.response?.data) {
            try {
              data.response.data = JSON.parse(data.response?.data);
            } catch (e) {}
          }
          merge({ [data.id]: data } as Partial<Record<string, CompleteItem>>);
        } catch (e) {
          console.warn(e);
        }
      });
      return unsubscribe;
    }
  }, [connected, pause]);

  const filterItems = React.useCallback(
    (items: CompleteItem[], filter?: string): CompleteItem[] => {
      if (!filter) {
        return items;
      }
      return items.filter(
        ({ request }) =>
          (request.href || `${request.protocol}${request.hostname}${request.path}`).indexOf(
            filter,
          ) !== -1,
      );
    },
    [requests, filter],
  );

  return (
    <>
      <Memo deps={[authorized, connected]}>
        {() => connected && <Auth authorized={authorized} authorize={feed.authorize} />}
      </Memo>
      <Memo deps={[connected, pause]}>
        {() => (
          <AppBar
            connected={connected}
            pause={pause}
            onChangeFilter={event => setFilter(event.target.value)}
            onClear={() => {
              set({});
            }}
            onPause={() => setPause(!pause)}
          />
        )}
      </Memo>
      <Memo deps={[requests]}>
        {() => <Table items={filterItems(requests, filter)} onClick={item => setTarget(item)} />}
      </Memo>
      <Memo deps={[target]}>
        {() => <Target target={target} onClose={() => setTarget(undefined)} />}
      </Memo>
    </>
  );
};
