'use strict';

const http = require('http');
const middleware = require('./middleware');

module.exports.start = exports = (router) => {
  const server = http.createServer(middleware(router));
  return server;
};

exports.Router = require('./router');
