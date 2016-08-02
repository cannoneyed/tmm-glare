import {
  setActiveIndex,
  setSelectedIndex,
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
    dispatch(setSelectedIndex(playlistIndex))

    // Play the soundcloud audio
    soundCloudAudio.play({ playlistIndex })
    dispatch(setPlaying(true))
  }
}
