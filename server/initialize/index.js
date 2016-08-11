const P = require('bluebird')
const initializeQueueListener = require('../listeners/queue')
const initializeGraph = require('../graph/initialize')

module.exports = P.coroutine(function* initializeApp() {
  // Initialize graph
  yield P.all([
    initializeGraph()
  ])

  // Set up listeners
  yield P.all([
    initializeQueueListener(),
  ])
})
