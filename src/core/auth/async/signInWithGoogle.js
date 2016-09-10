import Firebase from 'firebase'
import { firebase } from 'src/firebase'

// Manage the sign in with google flow (sign in button handler)
export default function signInWithGoogleAsync() {
  return () => {

    const provider = new Firebase.auth.GoogleAuthProvider()
    provider.addScope('email')

    // Set the local storage token, then trigger the redirect oauth flow
    firebase.auth().signInWithRedirect(provider)
  }
}
