'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const methods = ['GET', 'POST', 'PUSH', 'PATCH', 'DELETE'];

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

methods.forEach(method => {
  Router.prototype[method.toLowerCase()] = function(url, callback) {
    this.routes[method][url] = callback;
    return this;
  };
});

// static prototype serves up files in a specified directory
Router.prototype.static = function(dir) {
  return new Promise((resolve, reject) => {
    const directory = path.resolve(__dirname, dir);
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.log('Error reading directory: ' + dir);
        return reject(err);
      }
      for (let i = 0; i < files.length; i++) {
        const url = files[i];
        const filepath = path.join(directory, url);

        fs.stat(filepath, (err, stats) => {
          if (err) {
            console.log('Error getting stats for: ' + filepath);
            reject(err);
          }
          if (stats.isFile()) {
            this.routes.GET['/' + url] = (req, res) => {
              return new Promise((resolve, reject) => {
                const contentType =
                  mime.contentType(url) || 'application/octet-stream';
                fs.readFile(filepath, (err, data) => {
                  if (err) {
                    console.log(err);
                    reject('error reading file: ' + filepath);
                  }
                  res.writeHead(200, { 'Content-Type': contentType });
                  res.write(data.toString());
                  res.end();
                  resolve();
                });
              });
            };
          }
          // if finished final async op, resolve Promise
          if (i === files.length - 1) resolve();
        });

      }
    });
  });
};

module.exports = exports = Router;

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
