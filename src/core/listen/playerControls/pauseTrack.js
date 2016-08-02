import {
  setPlaying,
} from '../index'

import {
  getSoundCloudAudio,
} from '../selectors'

export default function pauseTrack() {
  return (dispatch, getState) => {
    const soundCloudAudio = getSoundCloudAudio(getState())
    soundCloudAudio.pause()
    dispatch(setPlaying(false))
  }
}
