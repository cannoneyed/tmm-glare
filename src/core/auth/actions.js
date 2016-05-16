import {
  INIT_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS
} from './action-types'

import { userActions } from 'src/core/user'
import * as util from 'src/util'

export function initAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    dispatch({
      type: INIT_AUTH,
      payload: firebase.getAuth(),
    })

    // If the user is logged in, get the user data and register the user listeners
    const { auth } = getState()
    if (auth.id) {
      return dispatch(userActions.getUserData(auth.id))
    }
  }
}

export function signInWithFacebook() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    firebase.authWithOAuthPopup('facebook', { scope: 'email' })
      .then((authData) => {
        // Lookup existing user object
        return firebase.child(`users/${authData.uid}`).once('value', snapshot => {
          const user = util.recordFromSnapshot(snapshot)

          // If the user exists, no need to create a new user record
          if (user) {
            return user
          }

          // Otherwise, create a new user record
          return firebase.child(`users/${authData.uid}`).set({
            connections: {},
            id: authData.facebook.id,
            hasAccess: false,
            displayName: authData.facebook.displayName,
            profileImageURL: authData.facebook.profileImageURL,
            email: authData.facebook.email,
          })
        })
        .then(() => {
          dispatch({
            type: SIGN_IN_SUCCESS,
            payload: authData,
          })

          // Now that the user is logged in, get the user data and register the user listeners
          return dispatch(userActions.getUserData(authData.uid))
        })
      })
  }
}

export function signOut() {
  return (dispatch, getState) => {
    const { firebase } = getState()
    firebase.unauth()
    dispatch({
      type: SIGN_OUT_SUCCESS
    })
  }
}
