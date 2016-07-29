import _ from 'lodash'
import { Graph } from 'graphlib'
import { getDistance } from './helpers'

import {
  setLoadedGraph,
} from '../index'

// Manage processing of the connections graph
export default function processGraphAsync() {
  return (dispatch, getState) => {
    const { connections: { rawData}, auth } = getState()
    const id = auth.id

    const g = new Graph({ directed: true })

    const allIds = {}
    _.each(rawData, (obj) => {
      const {
        from,
        to,
      } = obj

      allIds[from] = true
      allIds[to] = true

      g.setNode(to, obj)
      g.setEdge(from, to)
    })

    const connected = g.successors(id)
    const isConnected = createIsConnectedFunction(connected, id)

    _.each(allIds, (_bool, key) => {
      if (!isConnected(key)) {
        g.removeNode(key)
      }
    })

    const { nodes } = processNodes(g, id)
    const edges = processEdges(g)

    const graph = {
      nodes,
      edges,
      maximumDistance: '0.15mi',
      sharedWith: g.neighbors(id).length,
      graphSize: g.nodes().length - 1,
    }

    dispatch(setLoadedGraph(graph))
  }
}

function processNodes(g, ownId) {
  let maximumDistance = 0
  const ownNode = g.node(ownId)

  const nodes = g.nodes().map(id => {
    const node = g.node(id)
    if (id !== ownId) {
      const distance = getDistance(ownNode, node)
      if (distance > maximumDistance) {
        maximumDistance = distance
      }
    }

    return {
      id,
      shape: 'circularImage',
      _label: node.toName,
      image: node.toProfileImageURL,
    }
  })

  return { nodes, maximumDistance }
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
