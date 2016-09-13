import uniqBy from 'lodash.uniqby'

export const REGISTER_GEOQUERY = 'connect/REGISTER_GEOQUERY'
export const REMOVE_GEOQUERY = 'connect/REMOVE_GEOQUERY'

export const FOUND_BEACON = 'connect/FOUND_BEACON'
export const REMOVE_BEACON = 'connect/REMOVE_BEACON'

export const CONNECT_ERROR = 'connect/CONNECT_ERROR'
export const CONNECT_SUCCESS = 'connect/CONNECT_SUCCESS'
export const CONNECT_PENDING = 'connect/CONNECT_PENDING'
export const CONNECT_CANCELLED = 'connect/CONNECT_CANCELLED'

export const SET_CONNECTING = 'connect/SET_CONNECTING'


// Reducer
import {
  SIGN_OUT_SUCCESS
} from '../auth'

import {
  GEOLOCATION_DENIED,
  GEOLOCATION_ERROR,
} from '../location'

export const initialState = {
  isConnecting: false,
  beacons: [],
  geoquery: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SIGN_OUT_SUCCESS:
      return setIsConnecting(state, false)
    case REMOVE_BEACON:
      return filterOutBeacon(state, action.payload)
    case SET_CONNECTING:
      return setIsConnecting(state, action.payload)
    case GEOLOCATION_DENIED:
      return setIsConnecting(state, false)
    case GEOLOCATION_ERROR:
      return setIsConnecting(state, false)
    case FOUND_BEACON:
      return setNewBeacon(state, action.payload)
    case CONNECT_SUCCESS:
      return setIsConnecting(state, false)
    case CONNECT_ERROR:
      return setIsConnecting(state, false)
    case CONNECT_PENDING:
      return setIsConnecting(state, false)
    case CONNECT_CANCELLED:
      return {
        ...state,
        beacons: [],
        isConnecting: false,
      }
    case REGISTER_GEOQUERY:
      return { ...state, geoquery: action.payload }
    case REMOVE_GEOQUERY:
      return { ...state, geoquery: null }
    default:
      return state
  }

  function setIsConnecting(state, bool) {
    return { ...state, isConnecting: bool }
  }

  function filterOutBeacon(state, userId) {
    return { ...state,
      beacons: state.beacons.filter(beacon => {
        return beacon.key !== userId
      })
    }
  }

  function setNewBeacon(state, user) {
    const newBeacons = uniqBy(state.beacons.concat(user), 'key')
    return { ...state, beacons: newBeacons }
  }
}

// Action creators
export function registerGeoquery(geoquery) {
  return { type: REGISTER_GEOQUERY, payload: geoquery }
}

export function removeGeoquery() {
  return { type: REMOVE_GEOQUERY }
}

export function foundBeacon(user) {
  return { type: FOUND_BEACON, payload: user }
}

export function removeBeacon(userId) {
  return { type: REMOVE_BEACON, payload: userId }
}

export function connectSuccess() {
  return { type: CONNECT_SUCCESS }
}

export function connectCancelled() {
  return { type: CONNECT_CANCELLED }
}

export function connectError() {
  return { type: CONNECT_ERROR }
}

export function setConnecting(isConnecting) {
  return { type: SET_CONNECTING, payload: isConnecting }
}

export function connectPending(userId) {
  return { type: CONNECT_PENDING, payload: userId }
}

// Async actions
export * from './async'
