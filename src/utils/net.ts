import * as net from 'net';

const offset = 1;

export async function getFreePort(basePort?: number): Promise<number> {
  return await new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(basePort ? basePort + offset : 0, () => {
      const port = (srv.address() as net.AddressInfo).port;
      srv.close((err) => {
        if (err != null) {
          if (basePort) {
            return getFreePort();
          } else {
            reject(err);
          }
        }
        resolve(port);
      });
    });
  });
}
