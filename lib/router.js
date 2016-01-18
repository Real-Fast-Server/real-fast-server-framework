'use strict';

const methods = ['GET', 'POST', 'PUSH', 'PATCH', 'DELETE'];
const fs = require('fs');

const Router = function() {
  this.routes =
    { '404': (req, res) => writeRes(res, '404 Not Found', 'text/plain', 404) };
  methods.forEach(method => {
    this.routes[method] = {};
  });
};

Router.prototype.route = function(req, res) {
  const method = req.method;
  const url = req.url;
  const endpoint = this.routes[method][url] || this.routes['404'];
  return endpoint(req, res);
};

// static prototype serves up files in a specified directory
Router.prototype.static = function(dir) {
  const method = 'GET';
  fs.readdir(dir, (err, data) => {
    if (err) return 'Error reading directory.';
    data.forEach((url) => {
      this.routes[method][url] = (req, res) => {
        fs.readFile(url, (err, file) => {
          if (err) return 'Error reading file.';
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(file);
        });
      };
    });
  });
};

methods.forEach(method => {
  Router.prototype[method.toLowerCase()] = function(url, callback) {
    this.routes[method][url] = callback;
    return this;
  };
});

module.exports = exports = Router;

function jsonParser(req) { //eslint-disable-line
  var content = '';
  req.on('data', (data) => {
    content += data.toString();
  });
  req.on('end', () => {
    var parsedContent = JSON.stringify(content);
    req.body = parsedContent;
  });
}

Router.prototype.send = function(res, message) {
  var type;
  if (typeof message === 'object') type = 'application/json';
  else if (message.startsWith('<!DOCTYPE html>')) type = 'text/html';
  else type = 'text/plain';
  writeRes(res, message, type);
};

// Write a message back.
// If not specified the contentType will be application/json and the
// status code will be 200
function writeRes(res, message, contentType, status) {
  contentType = contentType || 'application/json';
  status = status || 200;
  if (typeof message === 'object') message = JSON.stringify(message);
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(message);
}
