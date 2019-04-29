const express = require('express');
const http = require('http');
let config  = require('./config/default');

/**
 * initializes the express app
 * @param {config.Config} config
 * @returns {Express.Application}
 */
function init(cfg) {
  if(typeof cfg == 'object') {
    config = cfg;
  }

  let app = express();

  require('./app/routes').router(app);

  return app;
}

/**
 * starts the app
 * if you do not have one use init()
 * @param {Express.Application} app the express app
 * @returns {http.Server}
 */
function start(app, port) {
  port = port || config.server.port;

  let server = http.createServer((req, res) => {
    req.on('data', chunk => {
      console.log(`[${new Date().toUTCString()}]`, 'RECEIVED', chunk);
    });

    app(req, res);
  });

  server.listen(port, () => {
    if(config.server.log) console.log(`Started listening on port ${port}.`);
  });

  server.on('connection', (socket) => {
    socket.on('connect', () => {
      if(config.server.logConnection) console.log('Connection to socket:', socket);
    });

    socket.on('end', () => {
      if(config.server.logConnection) console.log('Connection to socket ended:', socket);
    });

    socket.on('close', () => {
      if(config.server.logConnection) console.log('Connection to socket closed:', socket);
    });

    socket.on('timeout', () => {
      if(config.server.logConnection) console.log('Connection to socket timed out:', socket);
    });

    socket.on('error', (err) => {
      if(config.server.logConnection) console.log(`[${err.name}] ${err.message}\n${err.stack}`);
    });
  });

  server.on('close', () => {
    if(config.server.log) console.log('Server Closed');
  });

  server.on('error', (err) => {
    if(config.server.log) console.error(`[${err.name}] ${err.message}\n${err.stack}`);
  });

  return server;
}

/**
 * stops the app
 * @param {http.Server} server the server]
 */
function stop(server) {
  server.close();
}

module.exports = {
  init,
  start,
  stop
};