const P = require('bluebird')
const graphData = require('../../graph/data')
const { firebase } = require('../../firebase')
const helpers = require('./helpers')

const db = firebase.database().ref()

module.exports = function processUserGraph({ data, resolve, reject }) {
  const { userId } = data

  return P.try(() => {
    const g = graphData.getGraph()

    const connected = g.successors(userId)

    const own = g.node(userId)

    const total = connected.length
    const maxDistance = connected.reduce((max, id) => {
      const other = g.node(id)
      const distance = helpers.getDistance(own, other)
      return distance > max ? distance : max
    }, 0)

    return {
      total,
      maxDistance,
    }
  })
  .then(processed => {
    return db.child(`userGraphs/${userId}`).set(processed)
  })
  // .then(resolve)
  // .catch(reject)
}
