# HTTP-DEBUG - NodeJS network debugging tool

## Installation

```sh
npm install @anissoft/http-debug --save-dev
```

## Usage

Import `start` command from package and execute it in the very beginning of your program. This will start the static server and provide exact link to the web interface in the stdout.

```js
const { start } = require('@anissoft/http-debug');

start({ port: 4900 });
```

The correct way to do so -  place the above code in a separate file (e.g. debug.js) and import it in your application's entry point (e.g. index.js).

```js
require('./debug.js');

// your code...
```
