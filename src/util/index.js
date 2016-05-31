export function recordFromSnapshot(snapshot) {
  let record = snapshot.val()

  if (record === null || typeof record !== 'object') {
    return record
  }

  record.key = snapshot.key
  return record
}
