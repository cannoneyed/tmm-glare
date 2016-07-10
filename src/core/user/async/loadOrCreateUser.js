import * as util from 'src/util'

export default function loadOrCreateUser(authUser) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    // Lookup existing user object
    return firebase.database().ref().child(`users/${authUser.uid}`).once('value', snapshot => {
      const user = util.recordFromSnapshot(snapshot)

      // If the user exists, no need to create a new user record
      if (user) {
        return user
      }

      // Otherwise, create a new user record
      const facebook = authUser.providerData[0]
      return firebase.database().ref().child(`users/${authUser.uid}`).set({
        connections: {},
        id: facebook.uid,
        hasAccess: false,
        displayName: facebook.displayName,
        profileImageURL: facebook.photoURL,
        email: facebook.email,
      })
    })
  }
}
