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

export function loadPlayerData() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child('playlistInfo').once('value', snapshot => {
      const { clientId, resolveUrl } = util.recordFromSnapshot(snapshot)
      const soundCloudAudio = new SoundCloudAudio(clientId)

      dispatch({ type: LOAD_PLAYER, payload: {
        clientId,
        resolveUrl,
        soundCloudAudio,
      }})
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
