export default function unregisterMessageListenerAsync(userId) {
  return (dispatch, getState) => {
    const { firebase } = getState()
    // Unregister the message listener
    firebase.database().ref().child(`messages/${userId}`).off()
  }
}
