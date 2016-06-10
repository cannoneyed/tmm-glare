import {
  LOAD_PLAYER,
  SET_PLAYING,
  SET_SEEKING,
  SET_TIME,
  SET_DURATION,
  SET_PLAYLIST,
  SET_ACTIVE_INDEX,
} from './action-types'

export const initialState = {
  clientId: null,
  isLoaded: false,
  resolveUrl: null,
  soundCloudAudio: null,
  // Player properties
  duration: 0,
  currentTime: 0,
  seeking: false,
  playing: false,
  playlist: null,
  activeIndex: 0,
}

export function listenReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PLAYER: {
      const { clientId, resolveUrl, soundCloudAudio } = action.payload
      return { ...state, clientId, resolveUrl, soundCloudAudio, isLoaded: true }
    }
    case SET_SEEKING:
      return { ...state, seeking: action.payload }
    case SET_PLAYING:
      return { ...state, playing: action.payload }
    case SET_TIME:
      return { ...state, currentTime: action.payload }
    case SET_DURATION:
      return { ...state, duration: action.payload }
    case SET_PLAYLIST:
      return { ...state, playlist: action.payload }
    case SET_ACTIVE_INDEX:
      return { ...state, activeIndex: action.payload }
    default:
      return state
  }
}
