// Action Types
export const SET_GLOBE_DATA = 'globe/SET_GLOBE_DATA'
export const SET_GLOBE_GLARE = 'globe/SET_GLOBE_GLARE'
export const MOUNT_GLOBE_RENDERER = 'globe/MOUNT_GLOBE_RENDERER'


import { CONNECT_SUCCESS } from 'src/core/connect'

// Reducer
export const initialState = {
  data: [],
  isLoaded: false,
  renderer: null,
  shouldGlare: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_GLOBE_DATA:
      return { ...state, isLoaded: true, data: action.payload }
    case SET_GLOBE_GLARE:
      return { ...state, shouldGlare: action.payload }
    case CONNECT_SUCCESS:
      return { ...state, shouldGlare: true }
    case MOUNT_GLOBE_RENDERER:
      return { ...state, renderer: action.payload }
    default:
      return state
  }
}

// Action creators
export function setGlobeData(payload) {
  return { type: SET_GLOBE_DATA, payload }
}

export function setGlobeGlare(payload) {
  if (payload === undefined) {
    payload = true
  }
  return { type: SET_GLOBE_GLARE, payload }
}

export function mountGlobeRenderer(renderer) {
  return { type: MOUNT_GLOBE_RENDERER, payload: renderer }
}



// Async Actions
export * from './async'
