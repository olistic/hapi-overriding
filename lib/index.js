'use strict';

// Load modules

var Hoek = require('hoek');
var Joi = require('joi');
var format = require('util').format;

// Declare internals

var internals = {
  defaults: {
    put: 'update',
    delete: 'destroy'
  },
  options: Joi.object({
    put: Joi.string(),
    delete: Joi.string()
  })
};


exports.register = function (server, options, next) {

  var validateOptions = internals.options.validate(options);
  if (validateOptions.error) {
      return next(validateOptions.error);
  }

  var settings = Hoek.clone(internals.defaults);
  Hoek.merge(settings, options);

  server.ext('onRequest', function (request, reply) {

    if (request.method === 'post') {
      var endings = Object.keys(settings).map(function (method) {
        return settings[method];
      });

      var urlPattern = format('(.*)\/(%s)$', endings.join('|'));

      var matches = new RegExp(urlPattern, 'g').exec(request.path);

      if (matches) {
        var url = matches[1];
        var action = matches[2];

        request.setUrl(url);

        for (var method in settings) {
          if (action === settings[method]) {
            request.setMethod(method);
            break;
          }
        }
      }
    }
    return reply.continue();
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
