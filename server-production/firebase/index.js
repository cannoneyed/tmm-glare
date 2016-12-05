'use strict';

var Firebase = require('firebase');
var GeoFire = require('geofire');

var _require = require('config');

var firebaseConfig = _require.firebaseConfig;


var firebase = Firebase.initializeApp(firebaseConfig);
var geofire = {
  beaconLocations: new GeoFire(firebase.database().ref().child('beaconLocations'))
};

module.exports = {
  firebase: firebase,
  geofire: geofire
};