import P from 'bluebird'
import * as util from 'src/util'

import {
  loadUser,
  registerUserListenersAsync,
  trackUserVisitAsync,
} from '../index'

export default function getUserDataAsync(userId) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return P.resolve()
    .then(() => {
      // Load user Data
      return firebase.database().ref().child(`users/${userId}`).once('value', snapshot => {
        const user = util.recordFromSnapshot(snapshot)
        dispatch(loadUser(user))

        // Now track the visit to the user
        return dispatch(trackUserVisitAsync(user))
      })
    })
    .then(() => {
      return dispatch(registerUserListenersAsync(userId))
    })
  }
}
