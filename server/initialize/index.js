const P = require('bluebird')
const logger = require('winston')

const initializeUserListeners = require('../listeners/users')
const initializeQueueListener = require('../listeners/queue')
const initializeGraph = require('../graph/initialize')
const processMap = require('../actions/process-map')
const graphData = require('../graph/data')
const users = require('../store/users')

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
    const connectedCount = g.nodes().length
    const userCount = Object.keys(users).length

    logger.info(`Ping! Total connected: ${connectedCount}, Total users: ${userCount}`)
  }, 30000)
})
