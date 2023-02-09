const { subscribe, startUI, RequestEvent } = require('../')
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require("child_process");

startUI(4900);
subscribe(RequestEvent.incomingRequestStart, event => console.log('incoming-start', event))
subscribe(RequestEvent.incomingRequestFinish,  event => console.log('incoming-end', event))
subscribe(RequestEvent.outgoingRequestStart,  event => console.log('outgoing-start', event))
subscribe(RequestEvent.outgoingRequestFinish,  event => console.log('outgoing-end', event))

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
    res.writeHead(500);
    res.write(`{"server": "http"}`)
    res.end();
  });
}).listen(9000, (...srgs) => console.log('started http server', ...srgs));

function postGzipLocally() {
  exec(`curl -v -i -k https://localhost:8000/root/?param=${Date.now()} -H'Content-Type: application/json' -H'Content-Encoding: gzip' --data-binary @${path.resolve(__dirname, 'body.gz')}`);
}

function postJsonLocally() {
  axios.post(`http://localhost:9000/api/v1/method?param=${Date.now()}`, { key: 'value' });
}

setInterval(postGzipLocally, 6000);
setInterval(postJsonLocally, 10000);

const urls = [
  'https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png',
  'https://api.publicapis.org/entries',
  'https://catfact.ninja/fact',
  'https://api.coindesk.com/v1/bpi/currentprice.json',
  'https://www.boredapi.com/api/activity',
  'https://dog.ceo/api/breeds/image/random',
  'https://official-joke-api.appspot.com/random_joke',
  'https://randomuser.me/api/',
];

let i = 0;
setInterval(() => {
  axios.get(urls[i]);
  i = i >= urls.length - 1 ? 0 : i + 1;
}, 3000);