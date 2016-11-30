const P = require('bluebird')
const _ = require('lodash')
const util = require('./util')
const scriptRunner = require('./script-runner')


scriptRunner(function* setLeaderboard({ firebase }) {
  const db = firebase.database().ref()

  const userGraphs = yield db.child('userGraph').once('value')
    .then(util.recordsFromSnapshot)

  const users = yield db.child('users').once('value')
    .then(util.recordsFromSnapshot)

  const usersByKey = _.keyBy(users, 'key')

  yield P.mapSeries(userGraphs, userGraph => {
    const { key, stats } = userGraph

    if (!stats.total) {
      return
    }

    const user = usersByKey[key]

    if (user.isAdmin) {
      return
    }

    const { displayName, profileImageURL } = user

    return db.child(`leaderboard/${key}`)
      .set({
        displayName,
        profileImageURL,
        score: stats.total,
      })
  })
})
