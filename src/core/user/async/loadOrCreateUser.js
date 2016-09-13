import * as util from 'src/util'
import { firebase } from 'src/firebase'

import {
  trackUserVisitAsync,
} from '../index'

export default function loadOrCreateUserAsync(authUser) {
  return (dispatch) => {
    const db = firebase.database().ref()

    // Lookup existing user object
    return db.child(`users/${authUser.uid}`).once('value', snapshot => {
      const user = util.recordFromSnapshot(snapshot)

      const provider = authUser.providerData[0]

      // If the user exists, track the visit, and update the user's profileImageURL Since
      // facebook expires the image url after a month
      if (user) {
        dispatch(trackUserVisitAsync(user))
        return db.child(`users/${authUser.uid}/profileImageURL`).set(provider.photoURL)
      }


      // Otherwise, create a new user record
      return db.child(`users/${authUser.uid}`).set({
        connections: {},
        id: provider.uid,
        hasAccess: false,
        visits: 0,
        displayName: provider.displayName,
        profileImageURL: provider.photoURL,
        email: provider.email,
      })
    })
  }
}
