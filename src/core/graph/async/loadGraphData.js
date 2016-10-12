import * as util from 'src/util'
import { firebase } from 'src/firebase'
import map from 'lodash.map'
import get from 'lodash.get'

import {
  setGraphData,
  setIsGraphLoading,
} from '../index'

export default function loadGraphData() {
  return (dispatch, getState) => {
    const { auth } = getState()

    const db = firebase.database().ref()
    const userId = auth.id

    // Clear the UserGraph entry in order to load another
    firebase.database().ref('userGraph').child(userId).once('value', snapshot => {
      if (snapshot.exists()) {
        return db.child(`userGraph/${userId}`).remove()
      }
    })
    .then(() => {
      // Add the USER_GRAPH job to the queue
      const tasksRef = firebase.database().ref('queue/tasks')
      tasksRef.push({
        type: 'USER_GRAPH',
        userId,
      })
      dispatch(setIsGraphLoading(true))
    })
    .then(() => {
      // Set up the listener for loading the userGraph
      firebase.database().ref().child(`userGraph/${userId}`).on('value', snapshot => {
        const res = util.recordFromSnapshot(snapshot)
        if (res !== null) {
          const { data: { connections }, stats } = res

          // Process the connections returned from the server
          const nodes = processConnections(connections, userId)

          // Set the graph data (data & stats)
          dispatch(setGraphData({ nodes, stats }))
        }
      })
    })
  }
}

// Create the map of data for the graph, formatted as such:
// { id, children: [ { id: children: ... } ] }
function processConnections(connections, userId) {
  const graph = {}

  // Connections response from server formatted as:
  // { from: [ to, to, ... ]

  // Create the initial objects that will comprise the graph
  map(connections, (children, from) => {
    graph[from] = { id: from }
    children.forEach(childId => {
      graph[childId] = graph[childId] || { id: childId }
    })
  })

  // Assign children references to each item in the graph
  map(connections, (children, from) => {
    graph[from].children = children.map(id => graph[id])
  })

  const minSize = 4
  const maxSize = 8
  const maxConnections = 10
  const delta = maxSize - minSize
  // Calculate node sizes
  map(graph, node => {
    const nConnections = get(node, 'children.length', 0)
    const fraction = nConnections > maxConnections ? 1 : nConnections / maxConnections
    node.size = minSize + (delta * fraction)

    if (node.id === userId) {
      node.isOwnUser = true
      node.size += delta / 4
    }
  })

  const nodes = []
  map(graph, node => nodes.push(node))
  return nodes
}
