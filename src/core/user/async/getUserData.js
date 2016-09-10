import P from 'bluebird'
import * as util from 'src/util'
import { firebase } from 'src/firebase'

import {
  loadUser,
  registerUserListenersAsync,
} from '../index'

export default function getUserDataAsync(userId) {
  return (dispatch) => {
    return P.resolve()
    .then(() => {
      // Load user Data
      return firebase.database().ref().child(`users/${userId}`).once('value', snapshot => {
        const user = util.recordFromSnapshot(snapshot)
        dispatch(loadUser(user))
      })
    })
    .then(() => {
      return dispatch(registerUserListenersAsync(userId))
    })
  }
}
