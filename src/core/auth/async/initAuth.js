import {
  signInSuccess,
  signInFailure,
} from '../index'

import { loadAppDataAsync } from 'src/core/app'
import { loadOrCreateUserAsync } from 'src/core/user'

// Called when the page loads, manages the facebook oauth redirect / login flow
export default function initAuthAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    // Set up a firebase auth state listener to get the currently logged in user (this will succeed)
    // if the user is logged in and a session token exists, otherwise we'll have to look for the
    // result of the oauth redirect)
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe()
      if (user) {
        // User signed in, dispatch a success action and fetch the user data
        dispatch(signInSuccess(user.uid))
        return dispatch(loadAppDataAsync())
      } else {
        // Otherwise, get the result of the redirect
        firebase.auth().getRedirectResult().then(result => {
          dispatch(handleRedirectResultAsync(result))
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
        // Dispatch a sign in success action
        dispatch(signInSuccess(authUser.uid))

        // Now that the user is logged in, get all data necessary to run the app
        return dispatch(loadAppDataAsync())
      })
  }
}
