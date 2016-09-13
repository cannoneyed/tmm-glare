const _ = require('lodash')
const logger = require('winston')
const P = require('bluebird')
const util = require('../util')
const graphData = require('./data')
const { firebase } = require('../firebase')

const db = firebase.database().ref()

module.exports = P.coroutine(function* () {
  const timeStart = Date.now()

  console.log('HEY!')

  const snapshot = yield db.child('connections').once('value')

  console.log('HO!')

  const connections = util.recordsFromSnapshot(snapshot)

  _.each(connections, connection => {
    graphData.setConnection(connection)
  })
  logger.info(`Initialized ${Object.keys(connections || {}).length} connections in ${Date.now() - timeStart} ms`)
})
