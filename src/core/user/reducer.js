import {
  UPDATE_USER,
} from './action-types'

export const initialState = null

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload
    default:
      return state
  }
}
