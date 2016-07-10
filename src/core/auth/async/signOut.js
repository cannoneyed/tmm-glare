import {
  signOutSuccess,
} from '../index'

// Manage signing out of the application
export default function signOut() {
  return (dispatch, getState) => {
    const { firebase } = getState()
    firebase.auth().signOut().then(() => {
      dispatch(signOutSuccess())
    })
  }
}
