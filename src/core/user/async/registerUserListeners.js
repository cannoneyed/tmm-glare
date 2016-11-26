import P from 'bluebird'
import * as util from 'src/util'
import { firebase } from 'src/firebase'
import getUnlockedTracks from '../../listen/get-unlocked-tracks'

import {
  updateAccess,
  addConnection,
} from '../index'

import {
  connectSuccess,
} from '../../connect/index'

import * as modalActions from 'src/core/modals'
const modalTypes = modalActions // Alias for the imported actions

let hadAccessAlready
let initializationTime

export default function registerUserListenersAsync(userId) {
  return (dispatch, getState) => {

    // Set the initialization time, with which to compare connection times for new conenctions
    initializationTime = new Date().getTime()


    const { user } = getState()
    hadAccessAlready = user.hasAccess

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
      const timestamp = util.recordFromSnapshot(snapshot)
      const id = snapshot.key

      // Since all keys on the object trigger this listener on load, ensure that the child_added
      // timestamp is not earlier than initialization time.
      const isEarlier = timestamp < initializationTime
      if (isEarlier) {
        return
      }

      dispatch(addConnection(id))
      dispatch(connectSuccess())

      // Now, handle unlocking additional tracks and notifying the user what tracks
      // have been unlocked
      const { user } = getState()
      const unlocked = getUnlockedTracks(user)

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

      const kind = hadAccessAlready ? modalTypes.DID_GIVE : modalTypes.DID_RECEIVE
      hadAccessAlready = true

      dispatch(modalActions.openModal({
        kind,
        data: {
          connectedUser,
        }
      }))
    })
  }
}
