'use strict';

const http = require('http');

module.exports = exports = (router) => {
  const server = http.createServer(router.route());
  return server;
};

exports.Router = require('./router');
