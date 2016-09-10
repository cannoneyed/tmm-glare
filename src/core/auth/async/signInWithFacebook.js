import Firebase from 'firebase'
import { firebase } from 'src/firebase'

// Manage the sign in with facebook flow (sign in button handler)
export default function signInWithFacebookAsync() {
  return () => {

    const provider = new Firebase.auth.FacebookAuthProvider()
    provider.addScope('email')

    // Set the local storage token, then trigger the redirect oauth flow
    firebase.auth().signInWithRedirect(provider)
  }
}
