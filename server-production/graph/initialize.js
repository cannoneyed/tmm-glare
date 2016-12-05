'use strict';

var _ = require('lodash');
var logger = require('winston');
var P = require('bluebird');
var util = require('../util');
var graphData = require('./data');

var _require = require('../firebase');

var firebase = _require.firebase;


var db = firebase.database().ref();

module.exports = P.coroutine(regeneratorRuntime.mark(function _callee() {
  var timeStart, snapshot, connections;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          timeStart = Date.now();
          _context.next = 3;
          return db.child('connections').once('value');

        case 3:
          snapshot = _context.sent;
          connections = util.recordsFromSnapshot(snapshot);


          _.each(connections, function (connection) {
            graphData.setConnection(connection);
          });

          logger.info('Initialized ' + Object.keys(connections || {}).length + ' connections in ' + (Date.now() - timeStart) + ' ms');

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));