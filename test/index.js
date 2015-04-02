'use strict';

// Load modules

var Lab = require('lab');
var Hapi = require('hapi');

// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var expect = require('code').expect;

describe('Registration', function () {

  it('should register', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.register(require('../'), function (err) {

      expect(err).to.not.exist();

      done();
    });
  });

  it('should register with options', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.register({
      register: require('../'),
      options: {
        put: 'update',
        delete: 'delete'
      }
    }, function(err) {

      expect(err).to.not.exist();

      done();
    });
  });

  it('should fail to register with bad options', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.register({
      register: require('../'),
      options: {
        foo: 'bar'
      }
    }, function (err) {

      expect(err).to.exist();
      expect(err.message).to.equal('"foo" is not allowed');
      done();
    });
  });
});

describe('Method override', function () {

  it('shouldn\'t do anything on a GET', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.route({ method: 'GET', path: '/', handler: function (request, reply) {

      reply('ok');
    }});

    server.register(require('../'), function (err) {

      expect(err).to.not.exist();
      server.inject({ url: '/' }, function (response) {

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal('ok');

        done();
      });
    });
  });

  it('shouldn\'t do anything on normal POST', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.route({ method: 'POST', path: '/', handler: function (request, reply) {

      reply('ok');
    }});

    server.register(require('../'), function (err) {

      expect(err).to.not.exist();
      server.inject({ method: 'POST', url: '/' }, function (response) {

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal('ok');

        done();
      });
    });
  });

  it('should route POST to PUT when endpoint ends with /update', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.route({ method: 'PUT', path: '/tests', handler: function (request, reply) {

      reply('ok');
    }});

    server.register(require('../'), function (err) {

      expect(err).to.not.exist();
      server.inject({ method: 'POST', url: '/tests/update' }, function (response) {

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal('ok');

        done();
      });
    });
  });

  it('should route POST to DELETE when endpoint ends with /destroy', function (done) {

    var server = new Hapi.Server();

    server.connection({ host: 'localhost' });

    server.route({ method: 'DELETE', path: '/tests', handler: function (request, reply) {

      reply('ok');
    }});

    server.register(require('../'), function (err) {

      expect(err).to.not.exist();
      server.inject({ method: 'POST', url: '/tests/destroy' }, function (response) {

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal('ok');

        done();
      });
    });
  });
});
