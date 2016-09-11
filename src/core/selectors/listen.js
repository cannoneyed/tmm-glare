import _ from 'lodash'

export function getTitleByIndex(state, index) {
  return `The M Machine - ${state.listen.playlist.tracks[index].title}`
}

export function getSoundCloudAudio(state) {
  return state.listen.soundCloudAudio
}

export function isTrackUnlocked(state) {
  const unlockedTracks = state.listen.unlockedTracks
  return (index) => {
    return !!unlockedTracks[index]
  }
}

export function getNextUnlockedTrack(state) {
  const unlockedTracks = state.listen.unlockedTracks
  return (currentIndex) => {
    const sliceIndex = _.indexOf(unlockedTracks.slice(currentIndex + 1), true)
    if (sliceIndex === -1) {
      return null
    }
    return sliceIndex + currentIndex + 1
  }
}

export function getPreviousUnlockedTrack(state) {
  const unlockedTracks = state.listen.unlockedTracks
  return (currentIndex) => {
    const sliceIndex = _.indexOf(unlockedTracks.slice(0, currentIndex).reverse(), true)
    if (sliceIndex === -1) {
      return null
    }
    return currentIndex - sliceIndex - 1
  }
}
