import {
  setPlaying,
} from '../index'

import {
  getSoundCloudAudio,
} from 'src/core/selectors/listen'

export default function pauseTrack() {
  return (dispatch, getState) => {
    const soundCloudAudio = getSoundCloudAudio(getState())
    soundCloudAudio.pause()
    dispatch(setPlaying(false))
  }
}
