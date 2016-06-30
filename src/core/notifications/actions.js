import _ from 'lodash'

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

  return (dispatch, getState) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification })

    if (dismissAfter) {
      setTimeout(() => {
        const { notifications } = getState()
        const found = _.find(notifications, lookup => {
          return lookup.id === notification.id
        })
        if (found) {
          dispatch({ type: DISMISS_NOTIFICATION, payload: notification.id })
        }
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
