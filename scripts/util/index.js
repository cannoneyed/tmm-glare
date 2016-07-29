const _ = require('lodash')

exports.recordFromSnapshot = function recordFromSnapshot(snapshot) {
  let record = snapshot.val()

  if (record === null || typeof record !== 'object') {
    return record
  }

  record.key = snapshot.key
  return record
}

exports.recordsFromSnapshot = function recordsFromSnapshot(snapshot) {
  let records = snapshot.val()

  if (records === null || typeof records !== 'object') {
    return records
  }

  return _.map(records, (record, key) => {
    return _.assign(record, { key })
  })
}
