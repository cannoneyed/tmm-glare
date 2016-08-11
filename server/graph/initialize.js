const _ = require('lodash')
const P = require('bluebird')
const util = require('../util')
const graphData = require('../graph/data')
const { firebase } = require('../firebase')

const db = firebase.database().ref()

module.exports = P.coroutine(function* () {
  const snapshot = yield db.child('connections').once('value')
  const connections = util.recordsFromSnapshot(snapshot)

  _.each(connections, connection => {
    graphData.setConnection(connection)
  })
})
