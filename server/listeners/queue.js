const logger = require('winston')
const Queue = require('firebase-queue')
const { firebase } = require('../firebase')
const setConnection = require('../actions/set-connection')
const processUserStats = require('../actions/process-user-stats')

const db = firebase.database()

let queue
const options = {
  numWorkers: 4,
}

module.exports = () => {
  queue = new Queue(db.ref('queue'), options, (data, progress, resolve, reject) => {
    // Read and process task data
    const { type } = data

    if (type === 'SET_CONNECTION') {
      return setConnection({ data, resolve, reject })
    }

    if (type === 'USER_STATS') {
      logger.info('processing user stats...')
      return processUserStats({ data, resolve, reject })
    }
  })

  /* eslint-disable no-process-exit */
  process.on('SIGINT', () => {
    logger.info('Starting queue shutdown')
    queue.shutdown().then(() => {
      logger.info('Finished queue shutdown')
      process.exit(1)
    })
  })
}
