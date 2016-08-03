import _ from 'lodash'
import * as util from 'src/util'

import { TRACK_UNLOCKED, setJournal } from '../index'
import { unlockTracks } from 'src/core/listen'

export default function loadJournalAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    // Fetch the journal entries
    firebase.database().ref().child('journal').once('value', snapshot => {
      const journal = util.recordsFromSnapshot(snapshot)

      // Set the journal itself
      dispatch(setJournal(journal))

      // Now parse the journal to handle all journal entry types
      const unlockedTrackIds = _.map(journal, entry => entry)
        .filter(entry => entry.type === TRACK_UNLOCKED)
        .map(entry => entry.index)

      dispatch(unlockTracks(unlockedTrackIds))
    })
  }
}
