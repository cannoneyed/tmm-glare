'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.recordFromSnapshot = function (snapshot) {
  var record = snapshot.val();

  if (record === null || (typeof record === 'undefined' ? 'undefined' : _typeof(record)) !== 'object') {
    return record;
  }

  record.key = snapshot.key;
  return record;
};

exports.recordsFromSnapshot = function (snapshot) {
  var records = snapshot.val();
  return records;
};