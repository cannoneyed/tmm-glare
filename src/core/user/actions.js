import * as util from 'src/util'

import {
  CONNECT_SUCCESS
} from '../connect/action-types.js'

import {
  UPDATE_USER,
} from './action-types'

export function registerUserListener() {
  return (dispatch, getState) => {
    const { auth, firebase, user } = getState()
    const ref = firebase.child(`users/${auth.id}`)

    ref.on('value', snapshot => {
      const updated = util.recordFromSnapshot(snapshot)

      // When the user update changes hasAccess from false to true, broadcast a connect success!
      if (user && !user.hasAccess && updated && updated.hasAccess) {
        dispatch({ type: CONNECT_SUCCESS })
      }

      dispatch({
        type: UPDATE_USER,
        payload: updated,
      })
    })
  }
}
