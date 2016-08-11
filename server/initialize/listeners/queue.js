const Queue = require('firebase-queue')
const { firebase } = require('../../firebase')
const setConnection = require('../../actions/set-connection')

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
  })

  /* eslint-disable no-console, no-process-exit */
  process.on('SIGINT', () => {
    console.log('Starting queue shutdown')
    queue.shutdown().then(() => {
      console.log('Finished queue shutdown')
      process.exit(1)
    })
  })
}