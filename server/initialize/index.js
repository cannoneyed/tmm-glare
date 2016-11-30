const P = require('bluebird')
const logger = require('winston')

const initializeUserListeners = require('../listeners/users')
const initializeQueueListener = require('../listeners/queue')
const initializeGraph = require('../graph/initialize')
const processMap = require('../actions/process-map')
const graphData = require('../graph/data')

module.exports = P.coroutine(function* initializeApp() {
  logger.info('Initializing...')

  // Initialize graph
  yield P.all([
    initializeGraph(),
  ])

  const timeStart = Date.now()
  yield processMap()
  logger.info(`Processed map in ${Date.now() - timeStart} ms`)

  // Set up listeners
  yield P.all([
    initializeQueueListener(),
  ])

  // Set up listeners for tracking user plays / scorekeeping
  initializeUserListeners()

  // Log graph status at interval
  setInterval(() => {
    const g = graphData.getGraph()
    const count = g.nodes().length

    logger.info(`Ping! Total users: ${count}`)
  }, 30000)
})
