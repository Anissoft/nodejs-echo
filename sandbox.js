/* eslint-disable @typescript-eslint/no-var-requires */
require('./dist/node/index').default({ port: process.env.NODEJS_ECHO_PORT, secret: 'secret', debug: false });
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/path', (req, res) => res.send('Hello from path'));
app.listen(3000, () => console.log(`Example app listening on port 3000!`));

setInterval(() => {
  console.log('send get request');
    require('got')(
      'http://jsonplaceholder.typicode.com/posts',
      {json: true},
    ).then((res) => {
      console.log('response: ',res.body);
    }).catch(err => {
      console.error('error: ', err);
    });
  
}, 6000);

setInterval(() => {
  console.log('send post request');
  try {
    const https = require('https');
    const data = JSON.stringify({
      todo: 'Buy the milk',
    });

    const options = {
      hostname: 'flaviocopes.com',
      port: 443,
      path: '/todos',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, res => {
      // console.log(res.statusCode);
    });

    req.on('error', error => {
      console.error(error);
    });

    req.write(data);
    req.end();
  } catch (e) {
    console.error(e);
  }
}, 5000);
