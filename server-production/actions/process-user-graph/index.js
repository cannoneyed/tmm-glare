'use strict';

var P = require('bluebird');
var _ = require('lodash');
var logger = require('winston');
var graphData = require('../../graph/data');
var graphlib = require('graphlib');

var _require = require('../../firebase');

var firebase = _require.firebase;

var helpers = require('./helpers');

var users = require('../../store/users');

module.exports = function processUserGraph(_ref) {
  var data = _ref.data;
  var resolve = _ref.resolve;
  var reject = _ref.reject;
  var userId = data.userId;


  return P.resolve().then(function () {
    var g = graphData.getGraph();

    var connected = [];
    try {
      connected = graphlib.alg.postorder(g, userId);
    } catch (err) {
      if (err.message !== 'Graph does not have node: ' + userId) {
        throw err;
      } else {
        logger.warn(err.message);
      }
    }

    var own = g.node(userId);

    if (!own) {
      return;
    }

    // Process the graph data, and sum all plays
    // Formatted as { from: [to, to] }
    var connections = {};
    var score = 0;
    connected.forEach(function (userId) {
      var node = g.node(userId);
      score += _.get(users, [userId, 'plays'], 0) + 1;
      var from = node.from;

      connections[from] = (connections[from] || []).concat(userId);
    });

    // Process the graph stats
    var total = connected.length;

    var maxDistance = 0;
    _.each(connected, function (id) {
      var other = g.node(id);

      var distance = helpers.getDistance(own, other);
      maxDistance = distance > maxDistance ? distance : maxDistance;
    });

    var processed = {
      data: {
        connections: connections
      },
      stats: {
        total: total,
        maxDistance: maxDistance,
        score: score
      }
    };

    // Add the relevant user info to the leaderboard
    var user = users[userId];
    var leaderboardData = {
      displayName: user.displayName,
      profileImageURL: user.profileImageURL,
      score: score
    };

    logger.info('Processed graph for user ' + userId);

    var promises = [];
    // Add the operation to set the processsed graph
    promises.push(firebase.database().ref('userGraph').child(userId).set(processed));

    // Only add the user to the leaderboard if not an admin
    if (!user.isAdmin) {
      promises.push(firebase.database().ref('leaderboard').child(userId).set(leaderboardData));
    }

    return P.all(promises);
  }).then(resolve).catch(function (err) {
    logger.error(err);
    reject(err);
  });
};