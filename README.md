# HTTP-debug 

### Easy to use network debugging tool for node-js

![UI Example](screenshots/ui.png)

## Installation

```sh
npm --registry=https://registry.npmjs.org i @anissoft/http-debug@latest --no-save
```

## Usage

Import `start` command from package and execute it in the very beginning of your program. It will start the static server and provide exact link to the web interface in the terminal.

```js
const { start } = require('@anissoft/http-debug');

start({ port: 4900 });
```

The best way to do so -  place the above code in a separate file (e.g. debug.js) and import it in your application's entry point (e.g. index.js).

```js
require('./debug.js');

// your code...
```
