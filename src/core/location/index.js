// Actions
export const GEOLOCATION_SUCCESS = 'GEOLOCATION_SUCCESS'
export const GEOLOCATION_ERROR = 'GEOLOCATION_ERROR'
export const GEOLOCATION_DENIED = 'GEOLOCATION_DENIED'

// Reducer
export const initialState = null

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GEOLOCATION_SUCCESS:
      return action.payload
    default:
      return state
  }
}

// Action Creators
