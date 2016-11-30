const P = require('bluebird')
const _ = require('lodash')
const logger = require('winston')
const graphData = require('../../graph/data')
const graphlib = require('graphlib')
const { firebase } = require('../../firebase')
const helpers = require('./helpers')

const users = require('../../store/users')

module.exports = function processUserGraph({ data, resolve, reject }) {
  const { userId } = data

  return P.resolve().then(() => {
    const g = graphData.getGraph()

    let connected = []
    try {
      connected = graphlib.alg.postorder(g, userId)
    } catch (err) {
      if (err.message !== `Graph does not have node: ${userId}`) {
        throw err
      } else {
        logger.warn(err.message)
      }
    }

    const own = g.node(userId)

    if (!own) {
      return
    }

    // Process the graph data, and sum all plays
    // Formatted as { from: [to, to] }
    const connections = {}
    let score = 0
    connected.forEach(userId => {
      const node = g.node(userId)
      score += _.get(users, [userId, 'plays'], 0)
      const { from } = node
      connections[from] = (connections[from] || []).concat(userId)
    })

    // Process the graph stats
    const total = connected.length

    let maxDistance = 0
    _.each(connected, (id) => {
      const other = g.node(id)

      const distance = helpers.getDistance(own, other)
      maxDistance = distance > maxDistance ? distance : maxDistance
    })

    const processed = {
      data: {
        connections,
      },
      stats: {
        total,
        maxDistance,
        score,
      },
    }


    // Add the relevant user info to the leaderboard
    const user = users[userId]
    const leaderboardData = {
      displayName: user.displayName,
      profileImageURL: user.profileImageURL,
      score,
    }

    logger.info(`Processed graph for user ${userId}`)
    return P.all([
      firebase.database().ref('userGraph').child(userId).set(processed),
      firebase.database().ref('leaderboard').child(userId).set(leaderboardData),
    ])
  })
  .then(resolve)
  .catch(err => {
    logger.error(err)
    reject(err)
  })
}
