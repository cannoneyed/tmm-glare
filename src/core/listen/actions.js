import * as util from 'src/util'
import SoundCloudAudio from 'soundcloud-audio'

import {
  LOAD_PLAYER,
  SET_SEEKING,
  SET_PLAYING,
  SET_TIME,
  SET_DURATION,
  SET_PLAYLIST,
  SET_ACTIVE_INDEX,
} from './action-types'

import { loadingActions } from 'src/core/loading'

export function loadPlayerData() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    dispatch(loadingActions.setLoading(true))

    // Load the soundcloud playlist data from firebase
    return firebase.database().ref().child('playlistInfo').once('value', snapshot => {
      const { clientId, resolveUrl } = util.recordFromSnapshot(snapshot)
      const soundCloudAudio = new SoundCloudAudio(clientId)

      // Dispatch the meta information about the player, and the soundcloud audio object
      dispatch({ type: LOAD_PLAYER, payload: {
        clientId,
        resolveUrl,
        soundCloudAudio,
      }})

      // Now fetch the actual audio in the soundcloud audio object, and dispatch the playlist
      soundCloudAudio.resolve(resolveUrl, (data) => {
        dispatch(setPlaylist(data))
        dispatch(loadingActions.setLoading(false))
      })
    })
  }
}

export function setSeeking(seekState) {
  return { type: SET_SEEKING, payload: seekState }
}

export function setPlaying(playState) {
  return { type: SET_PLAYING, payload: playState }
}

export function setTime(time) {
  return { type: SET_TIME, payload: time }
}

export function setDuration(duration) {
  return { type: SET_DURATION, payload: duration }
}

export function setPlaylist(playlist) {
  return { type: SET_PLAYLIST, payload: playlist }
}

export function setActiveIndex(index) {
  return { type: SET_ACTIVE_INDEX, payload: index }
}
