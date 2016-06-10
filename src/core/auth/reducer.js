/* eslint-disable no-case-declarations */
import {
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  SIGN_IN_FAILURE,
  SET_AUTHENTICATING,
} from './action-types'


export const initialState = {
  authenticated: false,
  isAuthenticating: false,
  id: null
}

export function authReducer(state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case SET_AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: payload,
      }
    case SIGN_IN_SUCCESS:
      return {
        authenticated: true,
        id: payload.uid,
        isAuthenticating: false,
      }
    case SIGN_IN_FAILURE:
      return {
        authenticated: false,
        isAuthenticating: false,
        id: null,
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
