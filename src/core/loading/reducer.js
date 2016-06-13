import {
  START_LOADING,
  END_LOADING,
} from './action-types'

import {
  SIGN_IN_FAILURE,
} from '../auth/action-types'

import {
  LOAD_USER,
} from '../user/action-types'

export const initialState = true

export function loadingReducer(state = initialState, action) {
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
