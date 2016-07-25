// Actions
export const ADD_NOTIFICATION = 'notifications/ADD_NOTIFICATION'
export const DISMISS_NOTIFICATION = 'notifications/DISMISS_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = 'notifications/CLEAR_NOTIFICATIONS'

// Reducer
export const initialState = []
export default function reducer(state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case ADD_NOTIFICATION:
      return [...state, payload]
    case DISMISS_NOTIFICATION:
      return state.filter(notification => notification.id !== payload)
    case CLEAR_NOTIFICATIONS:
      return [state]
    default:
      return state
  }
}

// Action Creators
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
        const found = notifications.find(lookup => {
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
