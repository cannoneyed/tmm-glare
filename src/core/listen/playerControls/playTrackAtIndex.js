import {
  countPlayAsync,
  setActiveIndex,
  setSelectedIndex,
  setPlaying,
} from '../index'

import {
  getSoundCloudAudio,
  getTitleByIndex,
} from 'src/core/selectors/listen'


// Plays selected track in soundcloud audio player as well as tracking plays for
// influence score
export default function playTrackAtIndex(playlistIndex) {
  return (dispatch, getState) => {
    const state = getState()
    const soundCloudAudio = getSoundCloudAudio(state)
    const title = getTitleByIndex(state, playlistIndex)

    // Set the active player playlistIndex
    dispatch(setActiveIndex(playlistIndex))
    dispatch(setSelectedIndex(playlistIndex))

    // If a play track timeout already exists, cancel it to begin the next count play timeout
    if (soundCloudAudio.countPlayTimeout) {
      clearTimeout(soundCloudAudio.countPlayTimeout)
    }

    // Create a timeout that will be cancelled if track is skipped / stopped - we'll be attaching it
    // to the soundCloudAudio object because it's accessible to every action - not very clean /
    // reduxy but probably the best way to handle this at the moment
    soundCloudAudio.countPlayTimeout = setTimeout(() => {
      dispatch(countPlayAsync())
    }, 30000)

    // Play the soundcloud audio
    soundCloudAudio.play({
      playlistIndex,
      title,
    })

    dispatch(setPlaying(true))
  }
}
