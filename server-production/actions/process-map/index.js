'use strict';

var _ = require('lodash');
var graphData = require('../../graph/data');

var _require = require('../../firebase');

var firebase = _require.firebase;


var db = firebase.database().ref();

// Number of decimal points to trim lat / lng for grouping
var PRECISION = 2;
var MAX_VALUE = 0.5;

module.exports = function processMap() {
  var connections = graphData.getConnections();
  var processed = processConnections(connections);

  return db.child('map').set(processed);
};

function processConnections(connections) {
  // Process the raw connection data into the coordinate
  var coordinates = _.map(connections, function (connection) {
    return {
      lat: processCoordinate(connection.latitude),
      lng: processCoordinate(connection.longitude)
    };
  });

  // Count the occurences of each coordinate slug
  var counts = {};
  _.each(coordinates, function (coordinate) {
    var lat = coordinate.lat;
    var lng = coordinate.lng;

    var slug = lat + ':' + lng;
    var count = _.get(counts, [slug, 'count'], 0) + 1;
    counts[slug] = { lat: lat, lng: lng, count: count };
  });

  // Sort the counts and then map to an array of counts for statistical analysis
  var sortedCounts = _.map(counts, function (item, slug) {
    var count = item.count;

    return { count: count, slug: slug };
  }).sort(function (a, b) {
    return b.count - a.count;
  }).map(function (item) {
    return item.count;
  });

  var max = _.first(sortedCounts);

  // Now, map the coordinates and counts to data ingestible by the webGL globe
  var mapped = _.map(counts, function (item) {
    var lat = item.lat;
    var lng = item.lng;
    var count = item.count;

    var value = count / max * MAX_VALUE;
    return [lat, lng, value];
  });

  var output = _.flatten(mapped);

  return output;
}

function processCoordinate(coordinate) {
  return coordinate.toFixed(PRECISION) * 1;
}