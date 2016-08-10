const Queue = require('firebase-queue')
const { firebase } = require('../../firebase')
const setConnection = require('../../actions/set-connection')

const ref = firebase.database().ref('queue')

let queue

module.exports = () => {
  queue = new Queue(ref, (data, progress, resolve, reject) => {
    // Read and process task data
    const { type } = data

    if (type === 'SET_CONNECTION') {
      setConnection({ data }).then(resolve).catch(reject)
    }
  })

  process.on('SIGINT', () => {
    console.log('Starting queue shutdown')
    queue.shutdown().then(() => {
      console.log('Finished queue shutdown')
      process.exit(0)
    })
  })
}
