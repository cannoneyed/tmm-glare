export const START_LOADING = 'loading/START_LOADING'
export const END_LOADING = 'loading/END_LOADING'
export const START_CONNECTING = 'loading/START_CONNECTING'
export const END_CONNECTING = 'loading/END_CONNECTING'

import {
  SIGN_IN_FAILURE,
} from '../auth/action-types'

import {
  LOAD_USER,
} from '../user/action-types'

export const initialState = true
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return true
    case END_LOADING:
      return false
    case LOAD_USER:
      return false
    case SIGN_IN_FAILURE:
      return false
    default:
      return state
  }
}

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
