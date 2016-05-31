import {
  LOAD_PLAYLIST_INFO,
} from './action-types'

export const initialState = {
  info: {},
  isLoaded: false,
}

export function listenReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PLAYLIST_INFO: {
      const info = action.payload
      return {
        info,
        isLoaded: true
      }
    }
    default:
      return state
  }
}
