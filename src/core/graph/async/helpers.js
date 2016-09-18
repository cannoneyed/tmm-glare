import P from 'bluebird'
import * as util from 'src/util'
import { firebase } from 'src/firebase'

export function getConnectionIds(user) {
  const { connections } = user

  // Get the first level of connected users
  const connectionIds = Object.keys(connections || {})
    .filter(id => id)

  return connectionIds
}

export function getConnectionData(connectionIds, ownId) {
  return P.map(connectionIds, userId => {
    const connectionKey = [ownId, userId].join('::::')
    return firebase.database().ref('connections').child(connectionKey).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          return util.recordFromSnapshot(snapshot)
        }
      })
  }).filter(data => data)
}

export function getUser(userId) {
  return getUsers([userId]).then(users => users[0])
}

export function getUsers(userIds) {
  return P.map(userIds, userId => {
    return firebase.database().ref('users').child(userId).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          return util.recordFromSnapshot(snapshot)
        }
      })
  }).filter(data => data)
}
