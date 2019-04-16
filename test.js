require('./')({ debug: true, port: 3000 });

setInterval(() => {
  console.log('send request');
  try {
    require('request').post('http://jsonplaceholder.typicode.com/posts', {}, (error, response, body) => {
      console.log({ error })
    });
  } catch (e) {
    console.error(e);
  }
}, 10 * 1000);
