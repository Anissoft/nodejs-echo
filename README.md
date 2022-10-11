# NodeJS Echo
## Network debugging tool

NodeJS Echo provides an easy way to monitor requests from your nodejs application.

![list view](https://github.com/Anissoft/nodejs-echo/raw/master/screenshots/rl.png)

![request view](https://github.com/Anissoft/nodejs-echo/raw/master/screenshots/rw.png)

## Installation

```sh
npm install nodejs-echo --save-dev
```

## Usage

Import `start` command from package and execute it in the very beginning of your program. This will start the static server and provide exact link to the web interface in the stdout.

```js
const { start } = require('nodejs-echo');

start({ port: 4900, secret: 'any-string' });
```

> Parameter `secret` is optional but highly recommended to use in public networks;

The correct way to do so -  place the above code in a separate file (e.g. echo.js) and import it in your application's entry point (e.g. index.js).

```js
require('./echo.js');

// your code...
```
