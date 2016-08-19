const P = require('bluebird')
const _ = require('lodash')
const logger = require('winston')
const graphData = require('../../graph/data')
const userData = require('../../users/data')
const { firebase } = require('../../firebase')
const helpers = require('./helpers')

module.exports = function processUserGraph({ data, resolve, reject }) {
  const { userId } = data

  return P.try(() => {
    const g = graphData.getGraph()

    const connected = g.successors(userId) || []
    const own = g.node(userId)

    if (!own) {
      return resolve()
    }

    const { from } = own

    const ownUser = userData.get(userId)
    const fromUser = userData.get(from)

    const total = connected.length

    // Map the indices of the connected nodes for lookup
    const indexMap = {
      [ownUser.key]: 0,
    }
    _.each(connected, (id, index) => {
      indexMap[id] = index + 1
    })

    // Process the user's graph
    const outputGraphData = {
      links: [],
      nodes: [],
    }

    const processOutputNode = (id) => {
      const user = userData.get(id)
      const size = Object.keys(user.connections).length * 10 + 10

      outputGraphData.nodes.push({
        size,
        id: user.displayName,
        image: user.profileImageURL,
      })
    }

    const processOutputEdges = (id) => {
      const edges = g.outEdges(id).map(edge => edge.w)

      _.each(edges, otherId => outputGraphData.links.push({
        source: indexMap[id],
        target: indexMap[otherId],
      }))
    }

    processOutputNode(userId)
    processOutputEdges(userId)

    let maxDistance = 0
    _.each(connected, (id) => {
      const other = g.node(id)

      processOutputNode(id)
      processOutputEdges(id)

      const distance = helpers.getDistance(own, other)
      maxDistance = distance > maxDistance ? distance : maxDistance
    })

    return {
      stats: {
        total,
        maxDistance,
      },
      from: fromUser,
      graph: outputGraphData,
    }
  })
  .then(processed => {
    return firebase.database().ref('userGraph').child(userId).set(processed)
  })
  .then(resolve)
  .catch(err => {
    logger.error(err)
    reject(err)
  })
}
