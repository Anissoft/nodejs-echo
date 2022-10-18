import * as net from 'net';
import * as ws from 'ws';

export function createWebSocketServer(): Promise<ws.Server<ws.WebSocket>> {
  return new Promise((res, rej) => {
    const srv = net.createServer();
    srv.listen(0, () => {
        const port = (srv.address() as net.AddressInfo).port;
        srv.close((err) => {
          if (err) {
            rej(err);
          }

          const wss = new ws.Server({
            port: port,
            perMessageDeflate: {
              zlibDeflateOptions: {
                chunkSize: 1024,
                memLevel: 7,
                level: 3
              },
              zlibInflateOptions: {
                chunkSize: 10 * 1024
              },
              clientNoContextTakeover: true,
              serverNoContextTakeover: true,
              serverMaxWindowBits: 10,
              concurrencyLimit: 10,
              threshold: 1024,
            }
          }, () => {
            res(wss);
          });
        });
    });
  })
};
