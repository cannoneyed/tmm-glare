const logger = require('winston')
const Queue = require('firebase-queue')
const { firebase } = require('../firebase')
const setConnection = require('../actions/set-connection')
const processUserStatistics = require('../actions/process-user-statistics')
const processUserGraph = require('../actions/process-user-graph')

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

    if (type === 'USER_STATISTICS') {
      return processUserStatistics({ data, resolve, reject })
    }

    if (type === 'USER_GRAPH') {
      return processUserGraph({ data, resolve, reject })
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
