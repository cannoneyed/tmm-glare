/* eslint-disable no-case-declarations */
import {
  INIT_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  SET_AUTHENTICATING,
} from './action-types'


export const initialState = {
  authenticated: false,
  isAuthenticating: false,
  id: null
}

export function authReducer(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case SET_AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: payload,
      }
    case INIT_AUTH:
      let authenticated = payload !== null /* && (payload.expires * 1000) > Date.now() */
      return {
        ...state,
        authenticated,
        id: authenticated ? payload.uid : null,
      }

    case SIGN_IN_SUCCESS:
      return {
        authenticated: true,
        id: payload.uid,
        isAuthenticating: false,
      }

    case SIGN_OUT_SUCCESS:
      return {
        authenticated: false,
        id: null,
        isAuthenticating: false,
      }

    default:
      return state
  }
}
