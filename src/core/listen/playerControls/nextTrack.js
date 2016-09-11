import playTrackAtIndex from './playTrackAtIndex'
import goToTrackAtIndex from './goToTrackAtIndex'

import { getNextUnlockedTrack } from 'src/core/selectors/listen'

export default function nextTrack() {
  return (dispatch, getState) => {
    const state = getState()

    const { activeIndex, playing } = state.listen
    const nextTrack = getNextUnlockedTrack(state)(activeIndex)

    if (nextTrack === null) {
      return
    }

    if (playing) {
      dispatch(playTrackAtIndex(nextTrack))
    } else {
      dispatch(goToTrackAtIndex(nextTrack))
    }
  }
}
