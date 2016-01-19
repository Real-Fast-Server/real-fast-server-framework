'use strict';

const middleware = require('../lib/middleware');
const chai = require('chai');
const http = require('http');
chai.use(require('chai-http'));
const expect = chai.expect;

/* eslint-disable no-unused-expressions */

describe('res.send()', () => {
  it('should write a plain text response', done => {
    let called = 0;
    const testRes = {
      writeHead(code, contentType) {
        called++;
        expect(code).to.eql(200);
        expect(contentType).to.be.an('object');
        expect(contentType['Content-Type']).to.eql('text/plain');
      },
      write(message) {
        called++;
        expect(message).to.be.a('string');
        expect(message).to.eql('Hello World!');
      },
      end() {
        called++;
      }
    };
    const testRouter = {
      route(req, res) {
        for (let prop in testRes) {
          if (testRes.hasOwnProperty(prop)) {
            res['super' + prop] = res[prop];
            res[prop] = testRes[prop];
          }
        }
        res.send('Hello World!');
        expect(called).to.eql(3);
        done();
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

  it('should write a json response', done => {
    let called = 0;
    const testRes = {
      writeHead(code, contentType) {
        called++;
        expect(code).to.eql(200);
        expect(contentType).to.be.an('object');
        expect(contentType['Content-Type']).to.eql('application/json');
      },
      write(message) {
        called++;
        expect(message).to.be.a('string');
        expect(message).to.eql('{"msg":"Hello World!"}');
      },
      end() {
        called++;
      }
    };
    const testRouter = {
      route(req, res) {
        for (let prop in testRes) {
          if (testRes.hasOwnProperty(prop)) {
            res['super' + prop] = res[prop];
            res[prop] = testRes[prop];
          }
        }
        res.send({ 'msg': 'Hello World!' });
        expect(called).to.eql(3);
        done();
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
  afterEach(() => {
    this.server.close();
  });
});
