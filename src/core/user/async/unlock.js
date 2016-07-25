export default function unlockAsync() {
  return (dispatch, getState) => {

    const { firebase, user } = getState()

    return firebase.database().ref().child(`users/${user.key}/hasAccess`).set(true)
  }
}
