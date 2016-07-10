import Firebase from 'firebase'

// Manage the sign in with facebook flow (sign in button handler)
export default function signInWithFacebook() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    const provider = new Firebase.auth.FacebookAuthProvider()
    provider.addScope('email')

    // Set the local storage token, then trigger the redirect oauth flow
    firebase.auth().signInWithRedirect(provider)
  }
}
