import P from 'bluebird'

import {
  setInitialGraph,
} from '../index'

import {
  getConnectionData,
  getConnectionIds,
  getUsers,
} from './helpers'

const graph = {
  connections: {},
  users: {},
}

const processUserConnections = P.coroutine(function* processUserConnections(user) {
  // Set the root user entry
  graph.users[user.key] = { ...user, isExpanded: true }

  const connectionIds = getConnectionIds(user)

  // Fetch the first round of user information
  const users = yield getUsers(connectionIds)

  // Fetch the first round of connection information
  const connectionData = yield getConnectionData(connectionIds, user.key)

  users.forEach(user => {
    graph.users[user.key] = user
  })

  connectionData.forEach(connection => {
    const { to } = connection
    graph.connections[to] = connection
  })

  return users
})

export default function loadInitialGraph() {
  return (dispatch, getState) => {
    const { user } = getState()

    return P.coroutine(function* loadGraphData() {
      // Process connections of the root user
      const connectedUsers = yield processUserConnections(user)

      // Process the next step of connected users
      yield P.map(connectedUsers, user => processUserConnections(user))

      dispatch(setInitialGraph(graph))
    })()
  }
}
