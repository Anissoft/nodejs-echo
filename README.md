# NodeJS Echo - network debugging tool (WIP)

Provides an easy way to monitor (for now only outgoing) requests from your nodejs application.

## Installation

```sh
npm install nodejs-echo
```

## Usage

Simply import initial command from package and execute it in very beginning of your program. 

```js
const start = require('node-echo');

start({ port: 3001 })
```

It is recommended to place the above code in a separate file (e.g. echo.js) and to import it in your application's entry point (e.g. index.js).

```js
require('./echo'); 
const express = require('express');
...
```
