'use strict';

const jsonParser = require('./jsonParser.js');

// Takes a router and returns a function that runs any middleware on requests
// before calling the router.
module.exports = exports = function middleware(router) {
  return (req, res) => {
    jsonParser(req);
    req.on('end', () => {
      router.route(req, res);
    });
  };
};
