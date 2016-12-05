'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var logger = require('winston');
var P = require('bluebird');
var config = require('config');
var fetch = require('node-fetch');
var querystring = require('querystring');

var _require = require('../../firebase');

var firebase = _require.firebase;

var graphData = require('../../graph/data');
var processMap = require('../process-map');

var db = firebase.database().ref();

module.exports = function (_ref) {
  var data = _ref.data;
  var resolve = _ref.resolve;
  var reject = _ref.reject;
  var from = data.from;
  var to = data.to;
  var latitude = data.latitude;
  var longitude = data.longitude;
  var timestamp = data.timestamp;


  return P.coroutine(regeneratorRuntime.mark(function setConnection() {
    var _fromUpdate, _toUpdate;

    var qs, locationData, adminCode1, adminName1, name, countryName, state, connectionKey, connection, fromUpdate, toUpdate;
    return regeneratorRuntime.wrap(function setConnection$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            qs = querystring.stringify({
              lat: latitude,
              lng: longitude,
              username: config.geonames.username,
              cities: 'cities15000'
            });
            _context.next = 3;
            return fetch('http://api.geonames.org/findNearbyPlaceNameJSON?' + qs).then(function (res) {
              return res.json();
            }).then(function (data) {
              return _.get(data, 'geonames.0', {});
            });

          case 3:
            locationData = _context.sent;
            adminCode1 = locationData.adminCode1;
            adminName1 = locationData.adminName1;
            name = locationData.name;
            countryName = locationData.countryName;

            // Use the state abbreviation if we're in the United States

            state = countryName === 'United States' ? adminCode1 : adminName1;
            connectionKey = [from, to].join('::::');
            connection = {
              from: from,
              latitude: latitude,
              longitude: longitude,
              timestamp: timestamp,
              to: to,
              city: name,
              country: countryName,
              state: state || ''
            };

            // Set the connection entry

            _context.next = 13;
            return db.child('connections/' + connectionKey).set(connection);

          case 13:

            // Set the connection and set hasAccess true on both user objects
            fromUpdate = (_fromUpdate = {}, _defineProperty(_fromUpdate, 'connections/' + to, timestamp), _defineProperty(_fromUpdate, 'hasAccess', true), _fromUpdate);
            toUpdate = (_toUpdate = {}, _defineProperty(_toUpdate, 'connections/' + from, timestamp), _defineProperty(_toUpdate, 'hasAccess', true), _defineProperty(_toUpdate, 'from', from), _toUpdate);
            _context.next = 17;
            return P.props({
              to: db.child('users/' + from).update(fromUpdate),
              from: db.child('users/' + to).update(toUpdate)
            });

          case 17:

            // Update the internal graph
            graphData.setConnection(connection);

            // Update the map representation
            _context.next = 20;
            return processMap();

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, setConnection, this);
  }))().then(resolve).catch(function (err) {
    logger.error(err);

    var message = {
      type: 'CONNECTION_FAILED',
      timestamp: Date.now()
    };

    // Set the failed messages to both connecting users
    return P.props({
      to: db.child('messages/' + to + '/' + from).set(message),
      from: db.child('messages/' + from + '/' + to).set(message)
    }).then(function () {
      return reject(err);
    });
  }).finally(function () {
    // Remove the beacons
    return P.props({
      removeBeaconFrom: db.child('beacons/' + from).set(null),
      removeBeaconLocationFrom: db.child('beaconLocations/' + from).set(null),
      removeBeaconTo: db.child('beacons/' + to).set(null),
      removeBeaconLocationTo: db.child('beaconLocations/' + to).set(null)
    });
  });
};