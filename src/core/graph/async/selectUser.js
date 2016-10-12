import * as util from 'src/util'
import { firebase } from 'src/firebase'

import {
  setSelectedUserId,
  setUser,
} from '../index'

export default function selectUser(userId) {
  return (dispatch, getState) => {
    const { graph } = getState()
    const { selectedUser, users } = graph

    if (selectedUser === userId) {
      return
    }

    if (users[userId]) {
      return dispatch(setSelectedUserId(userId))
    }

    const db = firebase.database()

    // Load the user data of the selected node from firebase
    db.ref('users').child(userId).once('value', snapshot => {
      const userData = util.recordFromSnapshot(snapshot)
      const { displayName, profileImageURL, key } = userData
      let { from } = userData

      if (!from) {
        from = 'THE_SOURCE'
      }

      db.ref('connections').child(`${from}::::${key}`)
      .once('value', snapshot => {
        const connection = util.recordFromSnapshot(snapshot)
        const {
          city,
          state,
          country,
          timestamp,
          latitude,
          longitude,
        } = connection

        const user = {
          displayName,
          profileImageURL,
          from,
          key,
          city,
          state,
          country,
          timestamp,
          latitude,
          longitude,
        }

        dispatch(setSelectedUserId(userId))
        dispatch(setUser(user))
      })
    })
  }
}
