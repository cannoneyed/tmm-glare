import range from 'lodash.range'

export const UNLOCK_TRACKS = 'listen/UNLOCK_TRACKS'
export const LOAD_PLAYER = 'listen/LOAD_PLAYER'
export const SET_SEEKING = 'listen/SET_SEEKING'
export const SET_PLAYING = 'listen/SET_PLAYING'
export const SET_TIME = 'listen/SET_TIME'
export const SET_DURATION = 'listen/SET_DURATION'
export const SET_PLAYLIST = 'listen/SET_PLAYLIST'
export const SET_ACTIVE_INDEX = 'listen/SET_ACTIVE_INDEX'
export const SET_SELECTED_INDEX = 'listen/SET_SELECTED_INDEX'
export const UNLOCK_ALL_TRACKS = 'listen/UNLOCK_ALL_TRACKS'

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
  selectedIndex: 0,
  // Unlocked tracks
  unlockedTracks: [],
}

export default function reducer(state = initialState, action) {
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
    case SET_SELECTED_INDEX:
      return { ...state, selectedIndex: action.payload }
    case UNLOCK_TRACKS: {
      const idsToUnlock = action.payload
      const unlockedTracks = state.unlockedTracks.slice()
      idsToUnlock.forEach(trackId => {
        unlockedTracks[trackId] = true
      })
      return { ...state, unlockedTracks }
    }
    case UNLOCK_ALL_TRACKS: {
      const unlockedTracks = range(12).map(() => true)
      return { ...state, unlockedTracks }
    }
    default:
      return state
  }
}

export function unlockTracks(trackIds) {
  return { type: UNLOCK_TRACKS, payload: trackIds }
}

export function loadPlayer(payload) {
  return { type: LOAD_PLAYER, payload, }
}

export function setSeeking(seekState) {
  return { type: SET_SEEKING, payload: seekState }
}

export function setPlaying(playState) {
  return { type: SET_PLAYING, payload: playState }
}

export function setTime(time) {
  return { type: SET_TIME, payload: time }
}

export function setDuration(duration) {
  return { type: SET_DURATION, payload: duration }
}

export function setPlaylist(playlist) {
  return { type: SET_PLAYLIST, payload: playlist }
}

export function setActiveIndex(index) {
  return { type: SET_ACTIVE_INDEX, payload: index }
}

export function setSelectedIndex(index) {
  return { type: SET_SELECTED_INDEX, payload: index }
}

export function unlockAllTracks() {
  return { type: UNLOCK_ALL_TRACKS }
}

export * from './async'
export * from './playerControls'
