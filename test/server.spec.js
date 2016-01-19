'use strict';

const Router = require(__dirname + '/../lib/router.js');
const server = require(__dirname + '/../lib/server.js');
const chai = require('chai');
chai.use(require('chai-http'));
const request = chai.request;
const expect = chai.expect;

describe('http server: GET', () => {
  let router = new Router();
  let app;
  before(() => {
    router.get('/hello', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('hello world');
      res.end();
    });
    app = server.start(router).listen(3000);
  });
  after(() => {
    app.close();
  });

  it('should show the text hello', done => {
    request('localhost:3000')
      .get('/hello')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.eql('hello world');
        done();
    });
  });

  it('should show the 404', done => {
    request('localhost:3000')
      .get('/hellod')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(404);
        expect(res.text).to.eql('404 Not Found');
        done();
    });
  });
});

describe('http server: POST', () => {
  let router = new Router();
  let app;
  before(() => {
    router.post('/hellos', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('hellos world');
      res.end();
    });
    app = server.start(router).listen(3000);
  });
  after(() => {
    app.close();
  });

  it('should show the text hello', done => {
    request('localhost:3000')
      .post('/hellos')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.eql('hellos world');
        done();
    });
  });

  it('should show the 404', done => {
    request('localhost:3000')
      .post('/hellod')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(404);
        expect(res.text).to.eql('404 Not Found');
        done();
    });
  });
});
