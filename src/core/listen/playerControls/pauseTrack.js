import {
  setPlaying,
} from '../index'

import {
  getSoundCloudAudio,
} from 'src/core/selectors/listen'

export default function pauseTrack() {
  return (dispatch, getState) => {

    const soundCloudAudio = getSoundCloudAudio(getState())

    // If a play track timeout already exists, cancel it to begin the next count play timeout
    if (soundCloudAudio.countPlayTimeout) {
      clearTimeout(soundCloudAudio.countPlayTimeout)
    }

    soundCloudAudio.pause()
    dispatch(setPlaying(false))
  }
}
