const Router = require(__dirname + '/../lib/router.js');
const server = require(__dirname + '/../lib/server.js');
const chai = require('chai');
chai.use(require('chai-http'));
const request = chai.request;
const expect = chai.expect;

describe('http server: GET', () => {
  var router = new Router(); 
  before( (done) => {
    router.get('/hello', (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('hello world');
      res.end();
    });
    var app = server.start(router).listen(3000);
    done()
  });

  it('should show the text hello', (done) => {
    request('localhost:3000')
      .get('/hello')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.eql('hello world');
        done();
    });
  });

  it('should show the 404', (done) => {
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