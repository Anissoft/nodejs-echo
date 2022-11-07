import * as ws from 'ws';

export async function createWebSocketServer(port: number): Promise<ws.Server<ws.WebSocket>> {
  return await new Promise((resolve) => {
    const wss = new ws.Server(
      {
        port,
        perMessageDeflate: {
          zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
          },
          zlibInflateOptions: {
            chunkSize: 10 * 1024,
          },
          clientNoContextTakeover: true,
          serverNoContextTakeover: true,
          serverMaxWindowBits: 10,
          concurrencyLimit: 10,
          threshold: 1024,
        },
      },
      () => {
        resolve(wss);
      },
    );
  });
}
