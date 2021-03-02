import Box from '@anissoft/box';

export default class DataFeed extends Box<{
  authorized: boolean;
  connected: boolean;
}> {
  private ws?: WebSocket;
  private address: string;
  private secret: string;

  constructor({ address, secret }: { address: string; secret: string }) {
    super({
      authorized: false,
      connected: false,
    });
    this.address = address;
    this.secret = secret;
    this.connect();
  }

  public connect() {
    console.log('connecting...');
    this.ws = new WebSocket(this.address);
    this.listen(() => {
      console.log('connected');
      this.merge({ connected: true });
      this.authorize(this.secret).catch(() => { });
      this.ws!.onerror = (error: any) => {
        console.error(error);
        this.merge({ connected: false });
        this.ws!.close();
      };
      this.listen(() => {
        this.merge({ connected: false });
        this.connect();
      }, 'close');
    }, 'open');
    this.ws!.onerror = (error: any) => {
      this.ws!.close();
      this.connect();
    };
  }

  public authorize = (secret: string): Promise<void> =>
    new Promise((res, rej) => {
      console.log('authorization...');
      this.secret = secret;
      const timer = setTimeout(() => {
        unsubscribe();
        this.merge({ authorized: false });
        rej();
        console.log('authorization timed out');
      }, 3 * 1000);
      const unsubscribe = this.listen(event => {
        if (event.data === '{"auth": true}') {
          unsubscribe();
          clearTimeout(timer);
          this.merge({ authorized: true });
          console.log('authorization succeed');
          res();
        } else if (event.data === '{"auth": false}') {
          unsubscribe();
          clearTimeout(timer);
          this.merge({ authorized: false });
          console.log('authorization failed');
          rej();
        }
      });
      this.ws!.send(this.secret);
    });

  public listen = <K extends 'message' | 'error' | 'open' | 'close' = 'message'>(
    listener: (event: WebSocketEventMap[K]) => void,
    eventType: 'message' | 'error' | 'open' | 'close' = 'message',
  ) => {
    const callback = (event: WebSocketEventMap[K]) => {
      listener(event);
    };
    this.ws?.addEventListener(eventType, callback as any);
    // this.ws?.addEventListener('close', () => {
    //   this.ws?.removeEventListener(eventType, callback as any);
    // });
    return () => this.ws?.removeEventListener(eventType, callback as any);
  };
}
