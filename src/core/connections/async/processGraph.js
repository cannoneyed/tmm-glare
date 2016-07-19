import _ from 'lodash'
import { Graph } from 'graphlib'

import {
  setProcessedGraph,
} from '../index'

// Manage processing of the connections graph
export default function processGraphAsync() {
  return (dispatch, getState) => {
    const { connections: { rawData}, auth } = getState()
    const id = auth.id

    const g = new Graph({ directed: true })

    const allIds = {}
    _.each(rawData, (obj) => {
      const { from, to, lat, lng, timestamp } = obj

      allIds[from] = true
      allIds[to] = true

      g.setEdge(from, to, { lat, lng, timestamp })
    })

    const connected = g.successors(id)
    const isConnected = createIsConnectedFunction(connected, id)

    _.each(allIds, (_bool, key) => {
      if (!isConnected(key)) {
        g.removeNode(key)
      }
    })

    const graph = {
      nodes: processNodes(g, id),
      edges: processEdges(g)
    }

    dispatch(setProcessedGraph(graph))
  }
}

function processNodes(g, ownId) {
  return g.nodes().map(id => {
    return {
      id,
      imageType: setType(id, ownId),
      shape: 'image',
    }
  })
}

function processEdges(g) {
  return g.edges().map(edge => {
    return { from: edge.v, to: edge.w }
  })
}

function createIsConnectedFunction(connected, ownId) {
  const map = { [ownId]: true }
  _.each(connected, key => map[key] = true)
  return (id) => map[id]
}

function setType(a, b) {
  const type = (a === b) ? 'me' : 'other'
  return type
}
