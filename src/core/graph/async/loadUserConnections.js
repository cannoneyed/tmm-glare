import P from 'bluebird'

import {
  addUser,
  addConnection,
  setUserExpanded,
} from '../index'

import {
  getConnectionData,
  getConnectionIds,
  getUser,
  getUsers,
} from './helpers'

export default function loadUserConnections(userId) {
  return (dispatch, getState) => {
    const { connections } = getState()
    const existingUsers = connections.graph.users
    const existingConnections = connections.graph.connections

    return P.coroutine(function* loadGraphData() {

      const user = yield getUser(userId)

      const connectionIds = getConnectionIds(user)

      // Fetch the first round of user information
      const users = yield getUsers(connectionIds)

      // Fetch the first round of connection information
      const connectionData = yield getConnectionData(connectionIds, userId)

      dispatch(setUserExpanded(userId))

      users.forEach(user => {
        if (!existingUsers[user.key]) {
          dispatch(addUser(user))
        }
      })

      connectionData.forEach(connection => {
        if (!existingConnections[connection.to]) {
          dispatch(addConnection(connection))
        }
      })
    })()
  }
}
