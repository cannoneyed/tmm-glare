const P = require('bluebird')
const logger = require('winston')

const initializeQueueListener = require('../listeners/queue')
const initializeGraph = require('../graph/initialize')
const processMap = require('../actions/process-map')

module.exports = P.coroutine(function* initializeApp(isMaster) {
  // Initialize graph
  yield P.all([
    initializeGraph()
  ])

  if (isMaster) {
    const timeStart = Date.now()
    yield processMap()
    logger.info(`Initialized map in ${Date.now() - timeStart} ms`)
  }

  // Set up listeners
  yield P.all([
    initializeQueueListener(),
  ])
})
