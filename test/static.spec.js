'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const Router = require('../lib/router');

/* eslint-disable no-unused-expressions, no-sync */

describe('static routing', () => {
  const testDir = path.join(__dirname, 'testfiles');
  before(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    try {
      fs.writeFileSync(path.join(testDir, 'test.md'), '# Hello World');
      fs.writeFileSync(path.join(testDir, 'test.json'), '{"Hello":"World"}');
      fs.mkdir(path.join(testDir, 'emptyDir'));
    } catch (e) {
      console.log('File creation error in static routing tests');
    }
  });

  it('should return markdown content-type', done => {
    let called = 0;
    const testRes = {
      writeHead(statusCode, headers) {
        called++;
        expect(statusCode).to.equal(200);
        expect(headers).to.have.property('Content-Type');
        expect(headers['Content-Type'])
          .to.eql('text/x-markdown; charset=utf-8');
      },
      write(message) {
        called++;
        expect(message).to.equal('# Hello World');
      },
      end() {
        called++;
      }
    };
    const router = new Router();
    router.static(testDir)
      .then(() => {
        router.route({ method: 'GET', url: '/test.md' }, testRes)
        .then(() => {
          expect(called).to.eql(3);
          done();
        });
      });
  });

  it('should return json content-type', done => {
    let called = 0;
    const testRes = {
      writeHead(statusCode, headers) {
        called++;
        expect(statusCode).to.equal(200);
        expect(headers).to.have.property('Content-Type');
        expect(headers['Content-Type'])
          .to.eql('application/json; charset=utf-8');
      },
      write(message) {
        called++;
        expect(message).to.equal('{"Hello":"World"}');
      },
      end() {
        called++;
      }
    };
    const router = new Router();
    router.static(testDir)
      .then(() => {
        router.route({ method: 'GET', url: '/test.json' }, testRes)
        .then(() => {
          expect(called).to.eql(3);
          done();
        });
      });
  });

  it('should not register a route for directories', done => {
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
    router.static(testDir)
      .then(() => {
        router.route({ method: 'GET', url: '/emptyDir' }, testRes);
        expect(called).to.eql(2);
        done();
      });
  });

  after(() => {
    fs.readdirSync(testDir).forEach(file => {
      const currPath = path.join(testDir, file);
      if (fs.statSync(currPath).isFile()) {
        fs.unlinkSync(path.join(testDir, file));
        return;
      }
      fs.rmdirSync(currPath);
    });
    fs.rmdir(testDir);
  });
});
