import {
  signOutSuccess,
} from '../index'

// Manage signing out of the application
export default function signOutAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()
    firebase.auth().signOut().then(() => {
      dispatch(signOutSuccess())
    })
  }
}
