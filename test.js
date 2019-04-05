const prepare = require('./');
const fetch = require('node-fetch');

prepare({ debug: true, port: 3001, passphrase: 'hello' });

setInterval(() => { console.log('send request'); fetch('https://www.google.com') }, 10 * 1000);
