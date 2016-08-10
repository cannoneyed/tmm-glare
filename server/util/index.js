exports.recordFromSnapshot = (snapshot) => {
  let record = snapshot.val()

  if (record === null || typeof record !== 'object') {
    return record
  }

  record.key = snapshot.key
  return record
}


exports.recordsFromSnapshot = (snapshot) => {
  let records = snapshot.val()
  return records
}
