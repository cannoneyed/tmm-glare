import {
  GEOLOCATION_SUCCESS,
} from './action-types'

export const initialState = null

export function locationReducer(state = initialState, action) {
  switch (action.type) {
    case GEOLOCATION_SUCCESS:
      return action.payload
    default:
      return state
  }
}
