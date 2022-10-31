import * as path from 'path';
import * as http from 'http';
import { createServer } from 'http-server';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function startHTTPServer(port: number): Promise<{ server: http.Server }> {
  return new Promise((res) => {
    const server = createServer({
      root: path.resolve(__dirname, '..'),
    });
    server.listen(port, () => {
      res(server as any);
    });
  });
}
