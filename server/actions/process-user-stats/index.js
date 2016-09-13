const P = require('bluebird')
const _ = require('lodash')
const logger = require('winston')
const graphData = require('../../graph/data')
const { firebase } = require('../../firebase')
const helpers = require('./helpers')

module.exports = function processUserStats({ data, resolve, reject }) {
  const { userId } = data

  return P.resolve().then(() => {
    try {
      const g = graphData.getGraph()

      const connected = g.successors(userId) || []
      const own = g.node(userId)

      if (!own) {
        return resolve()
      }

      const total = connected.length

      let maxDistance = 0
      _.each(connected, (id) => {
        const other = g.node(id)

        const distance = helpers.getDistance(own, other)
        maxDistance = distance > maxDistance ? distance : maxDistance
      })

      const score = Math.floor(maxDistance) + (total * 5)

      return {
        total,
        maxDistance,
        score,
      }
    } catch (err) {
      console.log('🐷', err)
      throw err
    }
  })
  .then(processed => {
    logger.info('🍕', processed)
    logger.info(`Processed stats for user ${userId}`)
    return firebase.database().ref('userStats').child(userId).set(processed)
  })
  .then(resolve)
  .catch(err => {
    logger.error(err)
    reject(err)
  })
}
