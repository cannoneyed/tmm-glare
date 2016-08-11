const P = require('bluebird')
const _ = require('lodash')
const util = require('../util')
const graph = require('../graph/graph')
const initializeQueueListener = require('../listeners/queue')

const { firebase } = require('../firebase')
const db = firebase.database().ref()

module.exports = P.coroutine(function* initializeApp() {
  yield P.props({
    graph: loadGraph(),
    listeners: P.all([
      initializeQueueListener(),
    ]),
  })
})

function loadGraph() {
  return P.coroutine(function* loadGraph() {
    const snapshot = yield db.child('connections').once('value')
    const data = util.recordsFromSnapshot(snapshot)

    _.each(data, (obj) => {
      const {
        from,
        to,
      } = obj

      graph.setNode(to, obj)
      graph.setEdge(from, to)
    })
  })()
}
