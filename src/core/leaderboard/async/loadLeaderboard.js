import map from 'lodash.map'
import * as util from 'src/util'
import { firebase } from 'src/firebase'

import { setLeaderboard } from '../index'

export default function loadLeaderboardAsync() {
  return (dispatch) => {

    // Fetch the journal entries
    firebase.database().ref('leaderboard')
      .orderByChild('score')
      .limitToLast(20)
      .once('value', snapshot => {
        const leaderboardObj = util.recordsFromSnapshot(snapshot)

        const leaderboard = map(leaderboardObj, (user, key) => {
          user.key = key
          return user
        }).sort((a, b) => b.score - a.score)

        // Set the leaderboard itself
        dispatch(setLeaderboard(leaderboard))
      })
  }
}
