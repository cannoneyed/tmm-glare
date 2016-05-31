import {
  START_LOADING,
  END_LOADING,
  START_CONNECTING,
  END_CONNECTING,
} from './action-types'

export function setLoading(state) {
  return (dispatch) => {
    const type = state ? START_LOADING : END_LOADING
    dispatch({ type })
  }
}

export function setConnecting(state) {
  return (dispatch) => {
    const type = state ? START_CONNECTING : END_CONNECTING
    dispatch({ type })
  }
}
