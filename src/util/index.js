export function recordFromSnapshot(snapshot) {
  let record = snapshot.val()

  if (record === null) {
    return null
  }

  record.key = snapshot.key()
  return record
}
