require('dotenv').config()
const P = require('bluebird')
const Firebase = require('firebase')
const firebaseConfig = require('../config')

// Initialize firebase and geofire
const firebase = Firebase.initializeApp(firebaseConfig)

module.exports = (generator) => {
  P.coroutine(generator)({ firebase }).then(() => {
    process.exit(1)
  })
}
