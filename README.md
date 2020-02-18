# NodeJS Echo - network debugging tool

Provides an easy way to monitor (for now only outgoing) requests from your nodejs application.

## Installation

```sh
npm install nodejs-echo --save-dev
```

## Usage

Simply import initial command from package and execute it in very beginning of your program.

```js
const { start } = require('nodejs-echo');

start({ port: 3000, secret: 'any-string' });
```

> Parameter `secret` is optional but highly recommended to use

Then just open in your browser `localhost:3000`.

It is recommended to place the above code in a separate file (e.g. echo.js) and to import it in your application's entry point (e.g. index.js).

```js
require('./echo');

// your code...
```

Remember that tool also occupies next port for its needs. Eg. if you select port 3000, 3001 should also be available.
