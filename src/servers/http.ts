import * as http from 'http';
import * as path from 'path';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function startHTTPServer(port: number): Promise<http.Server> {
  return await new Promise((resolve) => {
    import('http-server')
      .then(({ createServer }) => {
        return createServer({
          root: path.resolve(__dirname, '..'),
        });
      })
      .then((server: http.Server) => {
        server.listen(port, () => {
          resolve(server);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
