# real-fast-server-framework

A lightweight server/router combo built on top of node HTTP.
It provides some conveniences like JSON body parsing, static routing,
and a simple response API without any feature bloat.

## Getting started

Here's how you would get up and running with a server on port 3000 with a get and post route.

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

### Router

#### router.get(path, callback(req, res))

Adds a `GET` route that handles requests with the passed in callback.
Returns the router to allow for method chaining.

Example:
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

#### router.route(req, res)

This is the method the server should call when a request is made. It routes to entries on the routing table using the `method` and `url` properties of the `req` and runs the callback. Generally you want to be passing this in when you create your server.

See the Getting Started Guide for an example of where you use this.

#### router.routes

Object that holds the current routing table. Here's what it might look like for the code in the Getting Started Guide.

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

## Authors

This server/router was written by [Erika Hokanson](https://github.com/erikawho), [Logan Tegman](https://github.com/ltegman), [Jose Tello](https://github.com/josectello), and [James Vermillion](https://github.com/jamesvermillion) as coursework for the Javascript 401 course at Code Fellows.

## License

This project is licensed under the terms of the MIT license.
