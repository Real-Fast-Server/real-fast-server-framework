'use strict';

const expect = require('chai').expect;
const Router = require('../lib/router');

describe('Router', () => {
  it('should be able to register a route', () => {
    const router = new Router();
    const testReq = { method: 'GET', dir: './public' };
    let cbFired = false;
    router.static(testReq.dir, (req, res) => {
      cbFired = true;
      expect(req.method).to.eql(testReq.method);
      expect(req.dir).to.eql(testReq.dir);
      expect(res.text).to.eql()
    });
    router.route()(testReq, null);
    expect(cbFired).to.be.true;
  });
});
