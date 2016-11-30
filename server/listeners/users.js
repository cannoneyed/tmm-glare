const { firebase } = require('../firebase')
const util = require('../util')
const users = require('../store/users')

const db = firebase.database()

module.exports = () => {
  // Load all users and handle new users to count plays
  db.ref().child('users').on('child_added', (snapshot) => {
    const user = util.recordFromSnapshot(snapshot)

    users[user.key] = user
  })

  // Track user changes to add plays to the in-memory store
  db.ref().child('users').on('child_changed', (snapshot) => {
    const user = util.recordFromSnapshot(snapshot)

    users[user.key] = user
  })
}
