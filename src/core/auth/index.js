// Actions
export const SIGN_IN_SUCCESS = 'auth/SIGN_IN_SUCCESS'
export const SIGN_OUT_SUCCESS = 'auth/SIGN_OUT_SUCCESS'
export const SIGN_IN_FAILURE = 'auth/SIGN_IN_FAILURE'

export const initialState = {
  authenticated: false,
  isAuthenticating: false,
  id: null
}

// Reducer
export default function reducer(state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case SIGN_IN_SUCCESS:
      return {
        authenticated: true,
        id: payload,
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

// Action Creators
export function signInSuccess(uid) {
  return { type: SIGN_IN_SUCCESS, payload: uid }
}

export function signInFailure() {
  return { type: SIGN_IN_FAILURE }
}

export function signOutSuccess() {
  return { type: SIGN_OUT_SUCCESS }
}

// Async Actions
export * from './async'
