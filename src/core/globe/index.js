// Action Types
export const SET_GLOBE_DATA = 'globe/SET_GLOBE_DATA'
export const SET_GLOBE_GLARE = 'globe/SET_GLOBE_GLARE'

import { CONNECT_SUCCESS } from 'src/core/connect'

// Reducer
export const initialState = {
  data: [],
  isLoaded: false,
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


// Async Actions
export * from './async'
