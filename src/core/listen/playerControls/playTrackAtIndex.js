import {
  setActiveIndex,
  setSelectedIndex,
  setPlaying,
} from '../index'

import {
  getSoundCloudAudio,
  getTitleByIndex,
} from 'src/core/selectors/listen'

export default function playTrackAtIndex(playlistIndex) {
  return (dispatch, getState) => {
    const state = getState()
    const soundCloudAudio = getSoundCloudAudio(state)
    const title = getTitleByIndex(state, playlistIndex)

    // Set the active player playlistIndex
    dispatch(setActiveIndex(playlistIndex))
    dispatch(setSelectedIndex(playlistIndex))

    // Play the soundcloud audio
    soundCloudAudio.play({
      playlistIndex,
      title,
    })
    dispatch(setPlaying(true))
  }
}
