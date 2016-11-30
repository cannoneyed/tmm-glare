import {
  setTime,
} from 'src/core/listen'

export default function seekToBeginning() {
  return (dispatch, getState) => {
    const state = getState()
    const { soundCloudAudio } = state.listen

    // If a play track timeout already exists, cancel it to begin the next count play timeout
    if (soundCloudAudio.countPlayTimeout) {
      clearTimeout(soundCloudAudio.countPlayTimeout)
    }

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.duration)) {
      soundCloudAudio.audio.currentTime = 0
    }

    dispatch(setTime(0))
  }
}
