export function recordFromSnapshot(snapshot) {
  let record = snapshot.val()
  record.key = snapshot.key()
  return record
}
