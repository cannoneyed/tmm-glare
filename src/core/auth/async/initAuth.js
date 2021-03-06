import Raven from 'raven-js'

import {
  signInSuccess,
  signInFailure,
} from '../index'

import { firebase } from 'src/firebase'

import { loadAppDataAsync } from 'src/core/app'
import { loadOrCreateUserAsync } from 'src/core/user'

import * as notificationActions from 'src/core/notifications'

// Called when the page loads, manages the facebook oauth redirect / login flow
export default function initAuthAsync() {
  return (dispatch) => {
    // Set up a firebase auth state listener to get the currently logged in user (this will succeed)
    // if the user is logged in and a session token exists, otherwise we'll have to look for the
    // result of the oauth redirect)
    const unsubscribe = firebase.auth().onAuthStateChanged(authUser => {
      unsubscribe()
      if (authUser) {
        return dispatch(handleSuccesfulRedirectAsync(authUser))
      } else {
        // Otherwise, get the result of the redirect
        firebase.auth().getRedirectResult().then(result => {
          dispatch(handleRedirectResultAsync(result))
        }).catch(err => {
          dispatch(signInFailure())

          // Depending on the error, we'll need to dispatch different messages
          if (err.code === 'auth/account-exists-with-different-credential') {
            const { email } = err
            dispatch(notificationActions.addNotification({
              message: `An account has already been registered for ${email}`,
              kind: 'danger',
              dismissAfter: 4000,
            }))
          }
        })
      }
    })
  }
}

// General handler for firebase oauth redirect result
function handleRedirectResultAsync(result) {
  return (dispatch) => {
    const authUser = result.user

    if (authUser) {
      return dispatch(handleSuccesfulRedirectAsync(authUser))
    } else {
      return dispatch(signInFailure())
    }
  }
}

// Success handler for firebase oauth redirect result
function handleSuccesfulRedirectAsync(authUser) {
  return (dispatch) => {
    // Since we've succesfully fetched an authenticated user from the fireabase oauth redirect,
    // we'll need to first trigger the logic to load or create a user object in firebase (from the
    // facebook scope data we've fetched), then trigger our login success logic
    return dispatch(loadOrCreateUserAsync(authUser))
      .then(() => {
        // Attach the authorized user into the Raven error-tracking module
        Raven.setUserContext({
          email: authUser.email,
          id: authUser.uid,
        })

        // Dispatch a sign in success action
        dispatch(signInSuccess(authUser.uid))

        // Now that the user is logged in, get all data necessary to run the app
        return dispatch(loadAppDataAsync())
      })
  }
}
