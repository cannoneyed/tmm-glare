import {
  LOAD_USER,
  UPDATE_ACCESS,
  ADD_CONNECTION,
} from './action-types'

export const initialState = null

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER:
      return action.payload
    case UPDATE_ACCESS:
      return { ...state, hasAccess: action.payload }
    case ADD_CONNECTION: {
      const connection = action.payload
      return {
        ...state,
        connections: {
          ...state.connections,
          [connection]: connection,
        }
      }
    }
    default:
      return state
  }
}
