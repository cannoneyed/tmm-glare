'use strict';

var _ = require('lodash');
var graphlib = require('graphlib');

var g = new graphlib.Graph({ directed: true });

exports.getGraph = function () {
  return g;
};

exports.setConnection = function (connection) {
  var to = connection.to;
  var from = connection.from;
  var latitude = connection.latitude;
  var longitude = connection.longitude;
  var timestamp = connection.timestamp;

  g.setNode(to, { from: from, latitude: latitude, longitude: longitude, timestamp: timestamp });
  g.setEdge(from, to);
};

exports.getConnections = function () {
  return g.nodes().map(function (id) {
    return g.node(id);
  }).filter(_.identity);
};