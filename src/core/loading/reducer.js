import {
  START_LOADING,
  END_LOADING,
} from './action-types'

import {
  SET_AUTHENTICATING,
} from '../auth/action-types.js'

export const initialState = false

export function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return true
    case END_LOADING:
      return false
    case SET_AUTHENTICATING:
      return !!action.payload
    default:
      return state
  }
}
