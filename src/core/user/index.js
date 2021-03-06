// Action types
export const LOAD_USER = 'user/LOAD_USER'
export const UPDATE_ACCESS = 'user/UPDATE_ACCESS'
export const ADD_CONNECTION = 'user/ADD_CONNECTION'
export const SET_FROM_ID = 'user/SET_FROM_ID'

import {
  SIGN_OUT_SUCCESS,
} from '../auth'

// Reducer
export const initialState = null

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER:
      return { ...action.payload }
    case UPDATE_ACCESS:
      return { ...state, hasAccess: action.payload }
    case ADD_CONNECTION: {
      const { id, timestamp } = action.payload
      return {
        ...state,
        connections: {
          ...state.connections,
          [id]: timestamp,
        }
      }
    }
    case SIGN_OUT_SUCCESS:
      return null
    case SET_FROM_ID:
      return {
        ...state,
        from: action.payload,
      }
    default:
      return state
  }
}

export function loadUser(user) {
  return { type: LOAD_USER, payload: user }
}

export function updateAccess(access) {
  return { type: UPDATE_ACCESS, payload: access }
}

export function addConnection(id, timestamp) {
  return { type: ADD_CONNECTION, payload: { id, timestamp } }
}

export function setFromId(id) {
  return { type: SET_FROM_ID, payload: id }
}

export * from './async'
