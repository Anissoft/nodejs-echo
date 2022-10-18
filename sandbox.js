require('./dist/index.node').start({port: 4900});
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
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
    res.end(`{"server": "http"}`);
  });
}).listen(9000, (...srgs) => console.log('started http server', ...srgs));