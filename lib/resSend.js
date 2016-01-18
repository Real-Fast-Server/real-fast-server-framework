'use strict';

module.exports = exports = function send(req, res) {
  res.send = function(message, type) {
    let detectedType;
    if (typeof message === 'object') {
      detectedType = 'application/json';
      message = JSON.stringify(message);
    } else if (message.startsWith('<!DOCTYPE html>')) {
      detectedType = 'text/html';
    } else {
      detectedType = 'text/plain';
    }
    type = type || detectedType;
    this.writeHead(200, { 'Content-Type': type });
    this.write(message);
    this.end();
  };
};
