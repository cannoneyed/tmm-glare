import {
  setActiveIndex,
  setSelectedIndex,
  setTime,
} from 'src/core/listen'

export default function goToTrackAtIndex(index) {
  return (dispatch) => {
    dispatch(setActiveIndex(index))
    dispatch(setSelectedIndex(index))
    dispatch(setTime(0))
  }
}
