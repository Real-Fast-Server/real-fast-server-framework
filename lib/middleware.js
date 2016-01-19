'use strict';

const jsonParser = require('./jsonParser');
const resSend = require('./resSend');

// Takes a router and returns a function that runs any middleware on requests
// before calling the router.
module.exports = exports = function middleware(router) {
  return (req, res) => {
    jsonParser(req);
    resSend(req, res);
    for (let addon of exports.addons) {
      addon(req, res);
    }
    req.on('end', () => {
      router.route(req, res);
    });
  };
};

exports.use = function use(newMiddleware) {
  exports.addons.push(newMiddleware);
};

exports.addons = [];
