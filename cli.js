const { program } = require('commander');
const { createServer } = require('http-server');
const chalk = require('chalk');
const path = require('path');

program.version('3.0.0')
  .option('-p, --port <port>', 'network port')
  .option('-l, --listen <socket>', 'socket connection address')
  .option('-s, --secret <secret>', 'secret key for authorization');

program.parse(process.argv);

const { port = '4900', secret = '' } = program.opts();
const { listen = `ws://localhost:${+port + 1}` } = program.opts();
const socket = encodeURIComponent(/^\d+$/.test(listen) ? `ws://localhost:${listen}` : listen);
const server = createServer({ root: path.resolve(__dirname, 'dist') });

server.listen(+port, () => {
  console.log(chalk.greenBright(`EchoUI started on http://localhost:${port}?socket=${socket}&secret=${secret}`));
});
