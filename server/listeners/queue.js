const logger = require('winston')
const Queue = require('firebase-queue')
const { firebase } = require('../firebase')
const setConnection = require('../actions/set-connection')
const processUserGraph = require('../actions/process-user-graph')
const sendWelcomeEmail = require('../actions/send-welcome-email')

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

    if (type === 'USER_GRAPH') {
      logger.info('processing user graph...')
      return processUserGraph({ data, resolve, reject })
    }

    if (type === 'SEND_WELCOME_EMAIL') {
      logger.info('sending new user email...', data.email)
      return sendWelcomeEmail({ data, resolve, reject })
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
