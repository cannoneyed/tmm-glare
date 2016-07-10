// Actions
export const GEOLOCATION_SUCCESS = 'location/GEOLOCATION_SUCCESS'
export const GEOLOCATION_ERROR = 'location/GEOLOCATION_ERROR'
export const GEOLOCATION_DENIED = 'location/GEOLOCATION_DENIED'

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

export function geolocationSuccess(location) {
  return { type: GEOLOCATION_SUCCESS, payload: location }
}

export function geolocationError() {
  return { type: GEOLOCATION_ERROR }
}

export function geolocationDenied() {
  return { type: GEOLOCATION_DENIED }
}
