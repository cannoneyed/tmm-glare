'use strict';

var _require = require('../firebase');

var firebase = _require.firebase;

var util = require('../util');
var users = require('../store/users');

var db = firebase.database();

module.exports = function () {
  // Load all users and handle new users to count plays
  db.ref().child('users').on('child_added', function (snapshot) {
    var user = util.recordFromSnapshot(snapshot);

    users[user.key] = user;
  });

  // Track user changes to add plays to the in-memory store
  db.ref().child('users').on('child_changed', function (snapshot) {
    var user = util.recordFromSnapshot(snapshot);

    users[user.key] = user;
  });
};