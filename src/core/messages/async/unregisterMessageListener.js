import { firebase } from 'src/firebase'

export default function unregisterMessageListenerAsync(userId) {
  return () => {
    // Unregister the message listener
    firebase.database().ref().child(`messages/${userId}`).off()
  }
}
