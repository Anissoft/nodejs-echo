# NodeJS Echo - network debugging tool (WIP)

Provides an easy way to monitor (for now only outgoing) requests from your nodejs application.

## Installation

```sh
npm install nodejs-echo
```

## Usage

Simply import initial command from package and execute it in very beginning of your program. 

```js
const start = require('nodejs-echo');

start({ port: 3000 })
```
Then just open in your browser `localhost:3000`.

It is recommended to place the above code in a separate file (e.g. echo.js) and to import it in your application's entry point (e.g. index.js).

```js
require('./echo'); 
const express = require('express');
...
```

Remember that tool also occupies next port for uts needs (WIP). Eg. if you select port 3000, 3001 should also be available.
