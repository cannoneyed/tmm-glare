import { firebase } from 'src/firebase'
import * as notificationActions from 'src/core/notifications'

import { REQUEST_ACCESS, messageSent } from '../index'

export default function sendMessageAsync(recipient) {
  return (dispatch, getState) => {
    const { user } = getState()

    const message = {
      from: user,
      type: REQUEST_ACCESS,
      timestamp: Date.now(),
    }

    // Register the message listener
    firebase.database().ref().child(`messages/${recipient.key}/${user.key}`)
      .set(message)
      .then(() => {
        dispatch(notificationActions.addNotification({
          message: `Asked ${recipient.displayName} for the album`,
          kind: 'info',
          dismissAfter: 5000,
        }))

        message.to = recipient.key
        dispatch(messageSent(message))
      })
  }
}
