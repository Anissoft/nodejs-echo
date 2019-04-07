require('./')({ debug: true, port: 3001, passphrase: 'hello' });
setInterval(() => {
  console.log('send request');
  require('http').get('http://jsonplaceholder.typicode.com/todos/1', res => {
    let data = '';

    // A chunk of data has been recieved.
    res.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    res.on('end', () => {
      console.log(data);
    });
  })
}, 10 * 1000);
