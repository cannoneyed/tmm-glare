const P = require('bluebird')
const _ = require('lodash')
const util = require('./util')
const scriptRunner = require('./script-runner')


scriptRunner(function* setConnectionTimestamp({ firebase }) {
  const db = firebase.database().ref()

  const connections = yield db.child('connections').once('value')
    .then(util.recordsFromSnapshot)

  const users = yield db.child('users').once('value')
    .then(util.recordsFromSnapshot)

  const connectionsById = _.keyBy(connections, 'key')

  yield P.mapSeries(users, user => {
    const { key, connections: userConnections } = user

    if (!userConnections) {
      return
    }

    _.map(userConnections, userId => {
      // Get the connection from:to or to:from
      const connection = connectionsById[`${key}::::${userId}`] || connectionsById[`${userId}::::${key}`]

      userConnections[userId] = connection.timestamp
    })


    return db.child(`users/${key}`)
      .update({
        connections: userConnections,
      })
  })
})
