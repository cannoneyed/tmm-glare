import {
  setTime,
} from 'src/core/listen'

export default function seekToBeginning() {
  return (dispatch, getState) => {
    const state = getState()
    const { soundCloudAudio } = state.listen

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.duration)) {
      soundCloudAudio.audio.currentTime = 0
    }

    dispatch(setTime(0))
  }
}
