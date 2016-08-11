const _ = require('lodash')
const graphlib = require('graphlib')

const g = new graphlib.Graph({ directed: true })

exports.getGraph = () => {
  return g
}

exports.setConnection = (connection) => {
  const { to, from, latitude, longitude, timestamp } = connection
  g.setNode(to, { from, latitude, longitude, timestamp })
  g.setEdge(from, to)
}

exports.getConnections = () => {
  return g.nodes().map(id => {
    return g.node(id)
  }).filter(_.identity)
}
