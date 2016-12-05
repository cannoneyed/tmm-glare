'use strict';

var P = require('bluebird');
var logger = require('winston');

var initializeUserListeners = require('../listeners/users');
var initializeQueueListener = require('../listeners/queue');
var initializeGraph = require('../graph/initialize');
var processMap = require('../actions/process-map');
var graphData = require('../graph/data');

module.exports = P.coroutine(regeneratorRuntime.mark(function initializeApp() {
  var timeStart;
  return regeneratorRuntime.wrap(function initializeApp$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          logger.info('Initializing...');

          // Initialize graph
          _context.next = 3;
          return P.all([initializeGraph()]);

        case 3:
          timeStart = Date.now();
          _context.next = 6;
          return processMap();

        case 6:
          logger.info('Processed map in ' + (Date.now() - timeStart) + ' ms');

          // Set up listeners
          _context.next = 9;
          return P.all([initializeQueueListener()]);

        case 9:

          // Set up listeners for tracking user plays / scorekeeping
          initializeUserListeners();

          // Log graph status at interval
          setInterval(function () {
            var g = graphData.getGraph();
            var count = g.nodes().length;

            logger.info('Ping! Total users: ' + count);
          }, 30000);

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, initializeApp, this);
}));