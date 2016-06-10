import {
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from './action-types'

export const initialState = []

export function notificationsReducer(state = initialState, action) {
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
