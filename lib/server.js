'use strict';

const http = require('http');
const middleware = require('./middleware');

exports.start = exports = router => {
  const server = http.createServer(middleware(router));
  server.use = middleware.use;
  return server;
};

exports.Router = require('./router');
