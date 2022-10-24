require('../dist/index.node').start({port: 4900});
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
  exec(`curl -v -i -k https://localhost:8000/ -H'Content-Encoding: gzip' --data-binary @${path.resolve(__dirname, 'body.gz')}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  });
}, 1000);

setTimeout(() => {
  axios.post('http://www.boredapi.com/api/activity', { key: 'value' }).then(res => {
    console.log('axios got', res.data);
  });
}, 2000);
