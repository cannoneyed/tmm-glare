import {
  INIT_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  SET_AUTHENTICATING,
} from './action-types'

import { userActions } from 'src/core/user'
import Firebase from 'firebase'
import * as helpers from './helpers'

export function initAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    const isAuthenticating = helpers.getAuthenticatingState()
    dispatch({ type: SET_AUTHENTICATING, payload: isAuthenticating })

    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: INIT_AUTH, payload: user })

      if (user) {
        // User signed in, fetch the user data
        return dispatch(userActions.getUserData(user.uid))
      } else {
        // Otherwise, get the result of the redirect
        firebase.auth().getRedirectResult().then(result => {
          const authUser = result.user
          return dispatch(handleRedirectResult(authUser))
        })
      }
    })
  }
}

function handleRedirectResult(authUser) {
  return (dispatch) => {
    if (!authUser) {
      return
    }
    return dispatch(userActions.loadOrCreateUser(authUser))
      .then(() => {
        dispatch({ type: SIGN_IN_SUCCESS, payload: authUser })

        helpers.setAuthenticatingStateToken(false)
        dispatch({ type: SET_AUTHENTICATING, payload: false })

        // Now that the user is logged in, get the user data and register the user listeners
        return dispatch(userActions.getUserData(authUser.uid))
      })
  }
}

export function signInWithFacebook() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    const provider = new Firebase.auth.FacebookAuthProvider()
    provider.addScope('email')

    firebase.auth().signInWithRedirect(provider)
    helpers.setAuthenticatingStateToken(true)
  }
}

export function signOut() {
  return (dispatch, getState) => {
    const { firebase } = getState()
    firebase.auth().signOut().then(() => {
      dispatch({
        type: SIGN_OUT_SUCCESS
      })
    })
  }
}
