import {
  setActiveIndex,
  setPlaying,
} from '../index'

import {
  getSoundCloudAudio,
} from '../selectors'

export default function playTrackAtIndex(playlistIndex) {
  return (dispatch, getState) => {
    const soundCloudAudio = getSoundCloudAudio(getState())

    // Set the active player playlistIndex
    dispatch(setActiveIndex(playlistIndex))

    // Play the soundcloud audio
    soundCloudAudio.play({ playlistIndex })
    dispatch(setPlaying(true))
  }
}
