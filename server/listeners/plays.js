const { firebase } = require('../firebase')
const util = require('../util')
const userPlays = require('../plays')

const db = firebase.database()


module.exports = () => {
  db.ref().child('users').on('child_added', (snapshot) => {
    const user = util.recordFromSnapshot(snapshot)

    userPlays[user.key] = user.plays || 0
  })

  db.ref().child('users').on('child_changed', (snapshot) => {
    const user = util.recordFromSnapshot(snapshot)

    userPlays[user.key] = user.plays || 0
  })
}
