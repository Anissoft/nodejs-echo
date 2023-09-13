import * as chalk from 'chalk';

import { startHTTPServer } from './servers/http';
import { createWebSocketServer } from './servers/ws';
import { emitter } from './subscribe.node';
import {
  NetworkEvent,
  NetworkEventType,
  RequestEvent,
  RequestItem,
} from './types';
import { stringifySafe } from './utils/json';
import { getFreePort } from './utils/net';

/* eslint-disable @typescript-eslint/no-var-requires */
const { name, version } = require('../package.json') as {
  name: string;
  version: string;
};

export async function startUI(opts?: number | { port?: number }) {
  if (process.env.NODE_ENV === 'production') {
    console.log(
      chalk.redBright(
        `!!!WARNING!!! It's highly inadvisable to run ${name}:${version} UI in production environment. Do it at your own risk`
      )
    );
  }

  const httpPort =
    (typeof opts === 'object' ? opts.port : opts) ?? (await getFreePort());
  const wssPort = await getFreePort(httpPort);
  const wss = await createWebSocketServer(wssPort);
  console.log(
    chalk.yellowBright(
      `${name}:${version} started to broadcast events [ws://localhost:${wssPort}]`
    )
  );
  await startHTTPServer(httpPort);
  console.log(
    chalk.greenBright(
      `${name}:${version} - UI has started on http://localhost:${httpPort}?socket=${wssPort}`
    )
  );

  emitter.on('message-to-socket', (message: NetworkEvent) => {
    wss.clients.forEach((client) => {
      if (client.readyState !== client.OPEN) {
        return;
      }
      client.send(stringifySafe(message), (err) => {
        if (err != null) {
          console.log(err);
        }
      });
    });
  });
}

export const start = startUI;

export { RequestEvent, NetworkEvent, NetworkEventType, RequestItem };
