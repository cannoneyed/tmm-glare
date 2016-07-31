import * as util from 'src/util'

import * as notificationActions from 'src/core/notifications'
import { REQUEST_ACCESS, messageReceived } from '../index'

export default function registerMessageListenerAsync() {
  return (dispatch, getState) => {
    const { firebase, user } = getState()

    // Clear out the message queue before subscribing
    firebase.database().ref().child(`messages/${user.key}`).set({}).then(() => {
      // Register the message listener
      firebase.database().ref().child(`messages/${user.key}`).on('child_added', snapshot => {
        const message = util.recordFromSnapshot(snapshot)
        const { from, type } = message

        // If the message is a connection request, set up a notification
        if (type === REQUEST_ACCESS) {
          const displayName = from.displayName

          dispatch(notificationActions.addNotification({
            message: `${displayName} asked you for the album`,
            kind: 'info',
            dismissAfter: 5000,
          }))

          dispatch(messageReceived(message))

          return firebase.database().ref().child(`messages/${user.key}/${message.key}`).remove()
        }
      })
    })
  }
}
