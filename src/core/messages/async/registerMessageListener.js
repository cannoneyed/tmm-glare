import * as util from 'src/util'
import { firebase } from 'src/firebase'

import * as notificationActions from 'src/core/notifications'
import { REQUEST_ACCESS, CONNECTION_FAILED, messageReceived } from '../index'

import { connectError } from '../../connect/'

export default function registerMessageListenerAsync() {
  return (dispatch, getState) => {
    const { user } = getState()
    const db = firebase.database().ref()

    // Clear out the message queue before subscribing
    db.child(`messages/${user.key}`).set({}).then(() => {
      // Register the message listener
      db.child(`messages/${user.key}`).on('child_added', snapshot => {
        const message = util.recordFromSnapshot(snapshot)
        const { type } = message

        // If the message is a connection request, set up a notification
        if (type === REQUEST_ACCESS) {
          const { from } = message
          const displayName = from.displayName

          dispatch(notificationActions.addNotification({
            message: `${displayName} asked you for the album`,
            kind: 'info',
            dismissAfter: 4000,
          }))

          dispatch(messageReceived(message))

          return db.child(`messages/${user.key}/${message.key}`).remove()
        }

        // If the message is a connection failure, set up a notification
        if (type === CONNECTION_FAILED) {
          dispatch(notificationActions.addNotification({
            message: 'Connection failed... Try again',
            kind: 'warning',
            dismissAfter: 4000,
          }))

          dispatch(messageReceived(message))
          dispatch(connectError())

          return db.child(`messages/${user.key}/${message.key}`).remove()
        }
      })
    })
  }
}
