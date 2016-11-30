import playTrackAtIndex from './playTrackAtIndex'
import goToTrackAtIndex from './goToTrackAtIndex'
import seekToBeginning from './seekToBeginning'

import { getPreviousUnlockedTrack } from 'src/core/selectors/listen'

export default function previousTrack() {
  return (dispatch, getState) => {
    const state = getState()

    const { activeIndex, playing, currentTime, soundCloudAudio } = state.listen

    // If a play track timeout already exists, cancel it to begin the next count play timeout
    if (soundCloudAudio.countPlayTimeout) {
      clearTimeout(soundCloudAudio.countPlayTimeout)
    }

    // Go to the beginning of the track if current time is 3 seconds or less
    if (currentTime > 3) {
      return dispatch(seekToBeginning())
    }

    const previousTrack = getPreviousUnlockedTrack(state)(activeIndex)

    if (previousTrack === null) {
      return
    }

    if (playing) {
      dispatch(playTrackAtIndex(previousTrack))
    } else {
      dispatch(goToTrackAtIndex(previousTrack))
    }
  }
}
