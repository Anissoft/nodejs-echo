require('./')({ debug: false, port: 3000 });

setInterval(() => {
  console.log('send request');
  try {
    require('request').get('http://jsonplaceholder.typicode.com/posts', {}, (error, response, body) => {
      if (error) console.log({ error })
    });
  } catch (e) {
    console.error(e);
  }
}, 5000);
