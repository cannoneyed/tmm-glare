import {
  signOutSuccess,
} from '../index'

import { firebase } from 'src/firebase'

// Manage signing out of the application
export default function signOutAsync() {
  return (dispatch, getState) => {
    const { listen } = getState()
    const { soundCloudAudio } = listen

    if (soundCloudAudio) {
      soundCloudAudio.stop()
    }

    firebase.auth().signOut().then(() => {
      dispatch(signOutSuccess())
    })
  }
}
