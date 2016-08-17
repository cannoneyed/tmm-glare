const _ = require('lodash')
const logger = require('winston')
const P = require('bluebird')
const util = require('../util')
const userData = require('./data')
const { firebase } = require('../firebase')

const db = firebase.database().ref()

module.exports = P.coroutine(function* initializeUsers() {
  const timeStart = Date.now()
  const snapshot = yield db.child('users').once('value')
  const users = util.recordsFromSnapshot(snapshot)

  _.each(users, (user, key) => {
    user.key = key
    userData.set(user)
  })
  logger.info(`Initialized ${Object.keys(users).length} users in ${Date.now() - timeStart} ms`)
})
