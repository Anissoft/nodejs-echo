import * as net from 'net';

const offset = 1;

export function getFreePort(basePort?: number): Promise<number> {
  return new Promise((res, rej) => {
    const srv = net.createServer();
    srv.listen(basePort ? basePort + offset : 0, () => {
      const port = (srv.address() as net.AddressInfo).port;
      srv.close((err) => {
        if (err) {
          if (basePort) {
            return getFreePort();
          } else {
            rej(err);
          }
        }
        res(port);
      });
    });
  });
}
