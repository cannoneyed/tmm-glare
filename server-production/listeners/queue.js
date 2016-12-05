'use strict';

var logger = require('winston');
var Queue = require('firebase-queue');

var _require = require('../firebase');

var firebase = _require.firebase;

var setConnection = require('../actions/set-connection');
var processUserGraph = require('../actions/process-user-graph');
var sendWelcomeEmail = require('../actions/send-welcome-email');

var db = firebase.database();

var queue = void 0;
var options = {
  numWorkers: 4
};

module.exports = function () {
  queue = new Queue(db.ref('queue'), options, function (data, progress, resolve, reject) {
    // Read and process task data
    var type = data.type;


    if (type === 'SET_CONNECTION') {
      return setConnection({ data: data, resolve: resolve, reject: reject });
    }

    if (type === 'USER_GRAPH') {
      logger.info('processing user graph...');
      return processUserGraph({ data: data, resolve: resolve, reject: reject });
    }

    if (type === 'SEND_WELCOME_EMAIL') {
      logger.info('sending new user email...');
      return sendWelcomeEmail({ data: data, resolve: resolve, reject: reject });
    }
  });

  /* eslint-disable no-process-exit */
  process.on('SIGINT', function () {
    logger.info('Starting queue shutdown');
    queue.shutdown().then(function () {
      logger.info('Finished queue shutdown');
      process.exit(1);
    });
  });
};