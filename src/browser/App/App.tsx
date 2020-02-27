import React from 'react';
import { useBox } from '@anissoft/box';
import Memo from '@anissoft/react-helpers/components/Memo';

import DataFeed from '../socket';
import AppBar from './AppBar';
import Table from './Table';
import { CompleteItem } from '../../types';
import Auth from './Auth';
import Target from './Target';

export default ({ feed, toggleTheme }: { feed: DataFeed; toggleTheme: () => void }) => {
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
          if (data.request?.body) {
            try {
              data.request.body = JSON.parse(data.request?.body);
            } catch (e) {}
          }
          if (data.response?.body) {
            try {
              data.response.body = JSON.parse(data.response?.body);
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
            toggleTheme={toggleTheme}
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
