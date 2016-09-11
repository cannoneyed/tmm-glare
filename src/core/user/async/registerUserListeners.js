import _ from 'lodash'
import P from 'bluebird'
import * as util from 'src/util'
import { firebase } from 'src/firebase'

import {
  updateAccess,
  addConnection,
} from '../index'

import {
  connectSuccess,
} from '../../connect/index'

import * as modalActions from 'src/core/modals'
const modalTypes = modalActions // Alias for the imported actions

export default function registerUserListenersAsync(userId) {
  return (dispatch, getState) => {
    // Register the user access listener
    firebase.database().ref().child(`users/${userId}/hasAccess`).on('value', snapshot => {
      const { user } = getState()
      const access = util.recordFromSnapshot(snapshot)

      // If the access hasn't changed, don't dispatch the action
      if (user.hasAccess === access) {
        return
      }

      dispatch(updateAccess(access))
    })

    // Register the user connection listener
    firebase.database().ref().child(`users/${userId}/connections`).on('child_added', snapshot => {
      const { user } = getState()
      const id = util.recordFromSnapshot(snapshot)

      // If the connection is already present on the user, don't dispatch the action
      const isConnected = _.get(user, ['connections', id])
      if (isConnected) {
        return
      }

      dispatch(addConnection(id))
      dispatch(connectSuccess())

      P.delay(2000).then(() => {
        dispatch(displayConnectionNotificationAsync(id))
      })
    })
  }
}

function displayConnectionNotificationAsync(id) {
  return (dispatch) => {
    firebase.database().ref().child(`users/${id}`).once('value', snapshot => {
      const connectedUser = util.recordFromSnapshot(snapshot)

      const didGive = Object.keys(connectedUser.connections).length <= 1
      const kind = didGive ? modalTypes.DID_GIVE : modalTypes.DID_RECEIVE

      dispatch(modalActions.openModal({
        kind,
        data: {
          connectedUser,
        }
      }))
    })
  }
}
