import * as util from 'src/util'

import {
  setConnectionGraph,
  setIsProcessingGraph,
} from '../index'

export default function loadConnectionGraph() {
  return (dispatch, getState) => {
    const { auth, firebase } = getState()

    const db = firebase.database().ref()
    const userId = auth.id

    // Clear the UserStatistics entry in order to load another
    firebase.database().ref('userStats').child(userId).once('value', snapshot => {
      if (snapshot.exists()) {
        return db.child(`userStats/${userId}`).remove()
      }
    })
    .then(() => {
      // Add the USER_GRAPH job to the queue
      const tasksRef = firebase.database().ref('queue/tasks')
      tasksRef.push({
        type: 'USER_GRAPH',
        userId,
      })
      dispatch(setIsProcessingGraph(true))
    })
    .then(() => {
      // Set up the listener for loading the userGraph
      firebase.database().ref().child(`userGraph/${userId}`).on('value', snapshot => {
        const stats = util.recordFromSnapshot(snapshot)
        if (stats !== null) {
          dispatch(setConnectionGraph(stats))
        }
      })
    })
  }
}
