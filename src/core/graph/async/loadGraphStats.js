import * as util from 'src/util'
import { firebase } from 'src/firebase'

import {
  setGraphStats,
  setIsProcessingStats,
} from '../index'

export default function loadGraphStats() {
  return (dispatch, getState) => {
    const { auth } = getState()

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
        type: 'USER_STATS',
        userId,
      })
      dispatch(setIsProcessingStats(true))
    })
    .then(() => {
      // Set up the listener for loading the userStats
      firebase.database().ref().child(`userStats/${userId}`).on('value', snapshot => {
        const stats = util.recordFromSnapshot(snapshot)
        if (stats !== null) {
          dispatch(setGraphStats(stats))
        }
      })
    })
  }
}
