import P from 'bluebird'
import * as util from 'src/util'
import { firebase } from 'src/firebase'

import graphlib from 'graphlib'
const g = new graphlib.Graph({ directed: true })

import {
  setGraph,
} from '../index'

const processUser = P.coroutine(function* processUser(user, ownId) {
  const connectionIds = getConnectionIds(user)

  // Fetch the first round of user information
  const users = yield getUsers(connectionIds)

  // Fetch the first round of connection information
  const connectionData = yield getConnectionData(connectionIds, ownId)

  addGraphData(users, connectionData)

  return users
})

export default function loadInitialGraph() {
  return (dispatch, getState) => {
    const { user, auth } = getState()

    return P.coroutine(function* loadGraphData() {
      const ownId = auth.id
      g.setNode(ownId, user)

      // Process connections of the root user
      yield processUser(user, ownId)

      // Process the next step of connected users
      // yield P.map(connectedUsers, user => processUser(user, user.key))

      dispatch(setGraph(g))
    })()
  }
}

function addGraphData(users, connectionData) {
  users.forEach(user => {
    g.setNode(user.key, user)
  })

  connectionData.forEach(connection => {
    const { from, to } = connection
    g.setEdge(from, to, connection)
  })

}

function getConnectionIds(user) {
  const { connections } = user

  // Get the first level of connected users
  const connectionIds = Object.keys(connections || {})
    .filter(id => id)

  return connectionIds
}

function getConnectionData(connectionIds, ownId) {
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

function getUsers(userIds) {
  return P.map(userIds, userId => {
    return firebase.database().ref('users').child(userId).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          return util.recordFromSnapshot(snapshot)
        }
      })
  }).filter(data => data)
}
