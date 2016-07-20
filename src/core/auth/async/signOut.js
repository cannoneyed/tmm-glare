import {
  signOutSuccess,
} from '../index'

// Manage signing out of the application
export default function signOutAsync() {
  return (dispatch, getState) => {
    const { firebase, listen } = getState()
    const { soundCloudAudio } = listen

    if (soundCloudAudio) {
      soundCloudAudio.stop()
    }

    firebase.auth().signOut().then(() => {
      dispatch(signOutSuccess())
    })
  }
}
