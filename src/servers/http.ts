import * as path from 'path';
import * as http from 'http';
import { createServer } from 'http-server';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function startHTTPServer(port: number): Promise<http.Server> {
  return await new Promise((resolve) => {
    const server = createServer({
      root: path.resolve(__dirname, '..'),
    }) as http.Server;
    server.listen(port, () => {
      resolve(server);
    });
  });
}
