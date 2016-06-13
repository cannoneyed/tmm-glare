import {
  START_LOADING,
  END_LOADING,
} from './action-types'

import {
  SET_AUTHENTICATING,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
} from '../auth/action-types.js'

export const initialState = true

export function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return true
    case END_LOADING:
      return false
    case SET_AUTHENTICATING:
      return !!action.payload
    case SIGN_IN_SUCCESS:
      return false
    case SIGN_IN_FAILURE:
      return false
    default:
      return state
  }
}
