import Firebase from 'firebase'

// Manage the sign in with google flow (sign in button handler)
export default function signInWithGoogleAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    const provider = new Firebase.auth.GoogleAuthProvider()
    provider.addScope('email')

    // Set the local storage token, then trigger the redirect oauth flow
    firebase.auth().signInWithRedirect(provider)
  }
}
