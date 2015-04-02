# hapi-overriding

**hapi-overriding** is a [hapi](https://github.com/hapijs/hapi) plugin that allows you to override the method of an incoming request, using HTTP verbs such as PUT and DELETE in places where the client doesn't support it. This package was inspired in [hapi-method-override](https://github.com/ubaltaci/hapi-method-override).

## Install

```sh
$ npm install hapi-overriding
```

## Usage

**hapi-overriding** works by extending the `onRequest` step of the request lifecycle. The extension function checks, for any incoming POST request, if the path ends with one of the defined action names (e.g. `destroy`). If so, it will change the method to the corresponding HTTP verb (e.g. `DELETE`). It will also change the url of the request, removing the action part and keeping your routes clean.

## Example

Server-side:
```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({ port: 3000 });

server.register(require('hapi-overriding'), function(err) {

  if (err) {
    throw err;
  }

  server.route({
    method: 'DELETE',
    path: '/users/{id}',    // No `/destroy` at the end!
    handler: function (request, reply) { ... }
  });

  server.start();
});
```

Client-side:
```html
<form method="POST" action="/users/507f1f77bcf86cd799439011/destroy">
  <button type="submit">Delete user</button>
</form>
```

## Options

The action names may be customized by passing the following options when registering the plugin:

- `put` - the action that represents the PUT verb. Defaults to `update`.
- `delete` - the action that represents the DELETE verb. Defaults to `destroy`.
