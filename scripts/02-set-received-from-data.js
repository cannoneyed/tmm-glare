const P = require('bluebird')
const _ = require('lodash')
const util = require('./util')
const scriptRunner = require('./script-runner')


scriptRunner(function* denormalizeConnections({ firebase }) {
  const db = firebase.database().ref()

  const connections = yield db.child('connections').once('value')
    .then(util.recordsFromSnapshot)

  const users = yield db.child('users').once('value')
    .then(util.recordsFromSnapshot)

  const usersById = _.keyBy(users, 'key')

  yield P.mapSeries(connections, connection => {
    const { to, from } = connection
    const fromUser = usersById[from]

    return db.child(`users/${to}`)
      .update({
        from: from,
        fromName: fromUser.displayName,
        fromProfileImageURL: fromUser.profileImageURL || null,
      })
  })
})
