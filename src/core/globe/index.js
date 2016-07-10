// Action Types
export const SET_GLOBE_DATA = 'globe/SET_GLOBE_DATA'

// Reducer
export const initialState = {
  data: [],
  isLoaded: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_GLOBE_DATA:
      return { isLoaded: true, data: action.payload }
    default:
      return state
  }
}

// Action creators
export function setGlobeData(payload) {
  return { type: SET_GLOBE_DATA, payload }
}

// Async Actions
export * from './async'
