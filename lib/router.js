'use strict';

const methods = ['GET', 'POST', 'PUSH', 'PATCH', 'DELETE'];

const Router = function() {
  this.routes =
    { '404': (req, res) => writeRes(res, '404 Not Found', 'text/plain', 404) };
  methods.forEach(method => {
    this.routes[method] = {};
  });
};

Router.prototype.route = function() {
  return (req, res) => {
    const method = req.method;
    const url = req.url;
    const body = JSONparser(req);
    req.body = body;
    const endpoint = this.routes[method][url] || this.routes['404'];
    return endpoint(req, res);
  };
};

methods.forEach(method => {
  Router.prototype[method.toLowerCase()] = function(url, callback) {
    this.routes[method][url] = callback;
    return this;
  };
});

module.exports = exports = Router;

function JSONparser(req) {
  var content = '';
  req.on('data', (data) => {
    content += data.toString();
  });
  req.on('end', () => {
    var parsedContent = JSON.stringify(content);
    req.body = parsedContent;
  });
}

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
