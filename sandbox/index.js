require('../dist/index.node').start(4900);
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require("child_process");

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname,'cert.pem'))
};

https.createServer(options, function (req, res) {
  req.on('data', () => undefined);
  req.on('end', () => {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    res.end(`{"server": "https"}`);
  });
}).listen(8000, (...srgs) => console.log('started https server', ...srgs));

http.createServer( function (req, res) {
  req.on('data', () => undefined);
  req.on('end', () => {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    res.write(`{"server": "http"}`)
    res.end();
  });
}).listen(9000, (...srgs) => console.log('started http server', ...srgs));

setTimeout(() => {
  exec(`curl -v -i -k https://localhost:8000/?param=${Date.now()} -H'Content-Encoding: gzip' --data-binary @${path.resolve(__dirname, 'body.gz')}`);
}, 1000);

setTimeout(() => {
  axios.post('http://www.boredapi.com/api/activity', { key: 'value' });
}, 2000);

setInterval(() => {
  exec(`curl -v -i -k https://localhost:8000/?param=${Date.now()} -H'Content-Encoding: gzip' --data-binary @${path.resolve(__dirname, 'body.gz')}`);
}, 10000);

setInterval(() => {
  axios.post('http://www.boredapi.com/api/activity', { key: 'value' });
}, 15000);
