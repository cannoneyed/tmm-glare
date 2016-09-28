import map from 'lodash.map'
import { firebase } from 'src/firebase'

import {
  loadPlayer,
  unlockTracks,
  setPlaylist,
  setActiveAndSelectedIndex,
} from '../index'

import * as util from 'src/util'
import SoundCloudAudio from '../soundcloud-audio'
import * as loadingActions from 'src/core/loading'

export default function loadPlayerData() {
  return (dispatch) => {

    dispatch(loadingActions.setLoading(true))

    // Load the soundcloud playlist data, and the unlocked tracks from firebase
    const db = firebase.database().ref()
    return db.child('playlistInfo').once('value', snapshot => {
      const {
        clientId,
        resolveUrl,
        unlockedTracks,
      } = util.recordFromSnapshot(snapshot)
      const soundCloudAudio = new SoundCloudAudio(clientId)

      // Dispatch the meta information about the player, and the soundcloud audio object
      const options = { clientId, resolveUrl, soundCloudAudio }
      dispatch(loadPlayer(options))

      // Dispatch the track lists that are unlocked
      const toUnlock = map(unlockedTracks, (isUnlocked, index) => {
        return index * 1
      })

      // We need to ensure the first unlocked track is selected
      const firstUnlockedTrack = toUnlock.sort()[0]
      dispatch(setActiveAndSelectedIndex(firstUnlockedTrack))

      // Unlock tracks
      dispatch(unlockTracks(toUnlock))

      // Now fetch the actual audio in the soundcloud audio object, and dispatch the playlist
      soundCloudAudio.resolve(resolveUrl, (data) => {
        dispatch(setPlaylist(data))
        dispatch(loadingActions.setLoading(false))
      })
    })
  }
}
