'use strict';

var P = require('bluebird');
var routing = require('./routing');

exports.handle = function (generator) {
  return function (req, res, next) {
    return P.coroutine(generator)(req, res, next).asCallback(routing.finish(req, res, next));
  };
};