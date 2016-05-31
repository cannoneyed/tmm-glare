import * as util from 'src/util'

import {
  LOAD_PLAYLIST_INFO,
} from './action-types'

import { loadingActions } from '../loading'

export function loadPlaylistInfo() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child('playlistInfo').once('value', snapshot => {
      const info = util.recordFromSnapshot(snapshot)

      dispatch({ type: LOAD_PLAYLIST_INFO, payload: info })
    })
  }
}
