'use strict';

const expect = require('chai').expect;
const Router = require('../lib/router');

/* eslint-disable no-unused-expressions */

describe('Router', () => {
  it('should create a router with a routes property', () => {
    const router = new Router();
    expect(router).to.have.property('routes');
    expect(router).to.be.an('object');
  });

  it('should be able to register a route', () => {
    const router = new Router();
    const testReq = { method: 'GET', url: '/test' };
    let cbFired = false;
    router.get('/test', (req, res) => {
      cbFired = true;
      expect(req.method).to.eql(testReq.method);
      expect(req.url).to.eql(testReq.url);
      expect(res).to.be.null;
    });
    router.route(testReq, null);
    expect(cbFired).to.be.true;
  });

  it('should be able to register a post request', () => {
    const router = new Router();
    const testReq = { method: 'POST', url: '/test' };
    let cbFired = false;
    router.post('/test', (req, res) => {
      cbFired = true;
      expect(req.method).to.eql(testReq.method);
      expect(req.url).to.eql(testReq.url);
      expect(res).to.be.null;
    });
    router.route(testReq, null);
    expect(cbFired).to.be.true;
  });

  it('should send 404 to unregistered routes', () => {
    let called = 0;
    const testRes = {
      writeHead(statusCode, headers) {
        expect(statusCode).to.equal(404);
        expect(headers).to.have.property('Content-Type');
        expect(headers['Content-Type']).to.eql('text/plain');
        called++;
      },
      end(message) {
        expect(message).to.equal('404 Not Found');
        called++;
      }
    };
    const router = new Router();
    router.route({ method: 'GET', url: 'invalid' }, testRes);
    expect(called).to.eql(2);
  });
});
