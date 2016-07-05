import {
  LOAD_GLOBE_DATA,
} from './action-types'

export const initialState = {
  data: [],
  isLoaded: false,
}

export function globeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GLOBE_DATA:
      return { isLoaded: true, data: action.payload }
    default:
      return state
  }
}
