import * as util from 'src/util'

import {
  UPDATE_USER,
} from './action-types'

export function registerUserListener() {
  return (dispatch, getState) => {
    const { auth, firebase } = getState()
    const ref = firebase.child(`users/${auth.id}`)

    ref.on('value', snapshot => {
      const user = util.recordFromSnapshot(snapshot)

      dispatch({
        type: UPDATE_USER,
        payload: user,
      })
    })
  }
}
