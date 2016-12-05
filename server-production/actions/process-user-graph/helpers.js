"use strict";

exports.getDistance = function (coords1, coords2) {
  var isMiles = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lat1 = coords1.latitude;
  var lng1 = coords1.longitude;
  var lat2 = coords2.latitude;
  var lng2 = coords2.longitude;


  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lng2 - lng1;
  var dLon = toRad(x2);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return isMiles ? d / 1.60934 : d;
};