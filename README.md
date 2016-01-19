# real-fast-server-framework

A lightweight server/router combo built on top of node HTTP.
It provides some conveniences like JSON body parsing, static routing,
and a simple response API without any feature bloat.

## Contents

+   [Getting Started](https://github.com/Real-Fast-Server/real-fast-server-framework#getting-started)
+   [API](https://github.com/Real-Fast-Server/real-fast-server-framework#api)
  +   [Server](https://github.com/Real-Fast-Server/real-fast-server-framework#server)
  +   [Router](https://github.com/Real-Fast-Server/real-fast-server-framework#router)
+   [Writing Middleware](https://github.com/Real-Fast-Server/real-fast-server-framework#writing-middleware)
+   [Dependencies](https://github.com/Real-Fast-Server/real-fast-server-framework#dependencies)
+   [Authors](https://github.com/Real-Fast-Server/real-fast-server-framework#authors)
+   [License](https://github.com/Real-Fast-Server/real-fast-server-framework#license)

## Getting started

Here's how you would get up and running with a server on port 3000 with GET and POST routes.

```js
const server = require('real-fast-server');
const router = new server.Router;

router
  .get('/', (req, res) => res.send('Hello World!'))
  .post('/api/test', (req, res) => {
    res.send('Successfully posted' + JSON.stringify(req.body));
  });

const app = server.start(router).listen(3000);
```

## API

### Server

#### server.start(router)

This method takes in a router object and returns a node http server.
The router needs to have a `route` method that knows how to handle the
http `req` and `res` parameters. The server is where the JSON parsing middleware
lives, but it comes built-in, no batteries required!

```js
const app = server.start(router);
app.listen(3000);
```

#### server.Router()

Constructor for the router object. Must be called with the `new` keyword.

```js
const router = new server.Router();
```

#### app.use(function(req, res))

Adds a middleware function to the running server. This function runs before requests are
handled and should be used to perform any transforms or processing you want to
do for every request. For example, you could create middleware that would parse
query strings into an object and add it as a property of `req`.

```js
const app = server.start(router);
app.use((req, res) => req.query = queryStringParser(req));
app.listen(3000);
```

#### req.send(message, [contentType])

Built in middleware adds this function to all response objects.
This will automatically handle writing headers and closing the connection to
simplify writing responses. It can detect JSON, HTML, and plaintext responses.
Optional second parameter can be used to override the autodetect and use a
specific Content-Type.

```js
router.post('/index', (req, res) => {
  // Will use Content-Type application/json
  res.send({ 'hello': 'world' });
});

router.get('/test' (req, res) => {
  // Will use Content-Type text/plain
  res.send('Hello world!');
});
```

### Router

#### router.get(path, callback(req, res))

Adds a `GET` route that handles requests with the passed in callback.
Returns the router to allow for method chaining.

```js
router.get('/index', (req, res) => {
  res.send('Hello world!');
});
```

#### router.post(path, callback(req, res))

Adds a `POST` route that handles requests with the passed in callback.
Returns the router to allow for method chaining.
See `router.get` docs for example usage.

#### router.put(path, callback(req, res))

Adds a `PUT` route that handles requests with the passed in callback.
Returns the router to allow for method chaining.
See `router.get` docs for example usage.

#### router.patch(path, callback(req, res))

Adds a `PATCH` route that handles requests with the passed in callback.
Returns the router to allow for method chaining.
See `router.get` docs for example usage.

#### router.delete(path, callback(req, res))

Adds a `DELETE` route that handles requests with the passed in callback.
Returns the router to allow for method chaining.
See `router.get` docs for example usage.

#### router.static(pathString)

Takes a relative or absolute path and creates routes for all the filenames found
in that folder. Returns an ES2015 promise in-case anything else you're doing is contingent
upon those routes being created. (Routes are created at calltime and changes to
the file structure after the method is called will not be reflected in routes).

```js
router.static('./public');
```

#### router.route(req, res)

This is the method the server should call when a request is made. It routes to
entries on the routing table using the `method` and `url` properties of the `req`
and runs the callback. Generally you want to be passing this in when you create your server.

See the Getting Started Guide for an example of where you use this.

#### router.routes

Object that holds the current routing table. Here's what it might look like for
the code in the Getting Started Guide.

```js
{
  'GET': {
    '/': (req, res) => res.send('Hello World!')
  },
  'POST': (req, res) => {
    res.send('Successfully posted' + JSON.stringify(req.body));
  },
  'PUT': {},
  'PATCH': {},
  'DELETE': {},
  '404': (req, res) => req.send('404 Not Found')
}
```

We throw in a `404` for free, but you're welcome to overwrite it!

## Writing Middleware

Real-Fast-Server is extensible and allows you to write your own middleware that
performs computations on the `req` and `res` objects of a request before they
are handled. Simply write a function that takes in a `req` and `res` and mutates
them in whatever way you require.

Example:
```js
myAwesomeMiddleware = (req, res) => {
  req.someUsefulProp = someCoolFunction();
};
app.use(myAwesomeMiddleware);
// All req objects will now have someUsefulProp
```

## Dependencies
"devDependencies": {
  "chai": "^3.4.1",
  "chai-http": "^1.0.0",
  "eslint": "^1.10.3",
  "gulp": "^3.9.0",
  "gulp-eslint": "^1.1.1",
  "gulp-mocha": "^2.2.0",
  "mocha": "^2.3.4"
},
"dependencies": {
  "mime-types": "^2.1.9"
}

## Authors

This server/router was written by [Erika Hokanson](https://github.com/erikawho),
[Logan Tegman](https://github.com/ltegman), [Jose Tello](https://github.com/josectello),
and [James Vermillion](https://github.com/jamesvermillion) as coursework for the
Javascript 401 course at Code Fellows.

## License

This project is licensed under the terms of the MIT license.
