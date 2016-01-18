'use strict';

const middleware = require('../lib/middleware');
const chai = require('chai');
const http = require('http');
chai.use(require('chai-http'));
const expect = chai.expect;

describe('jsonParser', () => {
  it('should add correct body prop to req', (done) => {
    const testRouter = {
      route: (req, res) => {
        expect(req.body).to.be.an('object');
        expect(req.body).to.eql({ 'test': 'test' });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('{"msg": "success"}');
        res.end();
      }
    };
    this.server = http.createServer(middleware(testRouter)).listen(3030);
    chai.request('localhost:3030')
      .post('/test')
      .send({ 'test': 'test' })
      .end(() => {
        done();
      });
  });
  after(() => {
    this.server.close();
  });
});
