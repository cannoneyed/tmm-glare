import {
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from './action-types'

export function addNotification(notification) {
  const { id, dismissAfter } = notification
  if (!id) {
    notification.id = new Date().getTime()
  }

  return (dispatch) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification })

    if (dismissAfter) {
      setTimeout(() => {
        dispatch({ type: DISMISS_NOTIFICATION, payload: notification.id })
      }, dismissAfter)
    }
  }
}

export function dismissNotification(id) {
  return { type: DISMISS_NOTIFICATION, payload: id }
}

export function clearNotifications(id) {
  return { type: CLEAR_NOTIFICATIONS, payload: id }
}
