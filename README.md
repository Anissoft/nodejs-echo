# NodeJS Echo - network debugging tool

Provides an easy way to monitor requests from your nodejs application.

![list view](https://github.com/Anissoft/nodejs-echo/raw/master/screenshots/rl.png)

![request view](https://github.com/Anissoft/nodejs-echo/raw/master/screenshots/rw.png)

## Installation

```sh
npm install nodejs-echo --save-dev
```

## Usage

In terminal execute:

```sh
npx nodejs-echo -p 4900 -l 4901 -s 123qwe
```

This will start static server and provide exact link to web interface.

Then you should start nodejs script, which you want to debug. To do so - import initial command from package and execute it in the very beginning of your program.

```js
const { start } = require('nodejs-echo');

start({ port: 4901, secret: 'any-string' });
```

> Parameter `secret` is optional but highly recommended to use in public networks

The best practice is to place the above code in a separate file (e.g. echo.js) and import it in your application's entry point (e.g. index.js).

```js
require('./echo.js');

// your code...
```