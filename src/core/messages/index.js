// Message types
export const REQUEST_ACCESS = 'REQUEST_ACCESS'

// Action types
export const MESSAGE_SENT = 'message/MESSAGE_SENT'
export const MESSAGE_RECEIVED = 'message/MESSAGE_RECEIVED'

import {
  CONNECT_ERROR,
  CONNECT_SUCCESS,
  CONNECT_CANCELLED,
} from '../connect'

// Reducer
export const initialState = {
  sent: [],
  received: [],
}

const clearAccessRequestMessages = (state) => {
  return {
    sent: state.sent.filter(message => message.type !== REQUEST_ACCESS),
    received: state.sent.filter(message => message.type !== REQUEST_ACCESS),
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_SENT: {
      return {
        ...state,
        sent: state.sent.concat(action.payload),
      }
    }
    case MESSAGE_RECEIVED: {
      return {
        ...state,
        received: state.received.concat(action.payload)
      }
    }
    case CONNECT_ERROR: {
      return clearAccessRequestMessages(state)
    }
    case CONNECT_SUCCESS: {
      return clearAccessRequestMessages(state)
    }
    case CONNECT_CANCELLED: {
      return clearAccessRequestMessages(state)
    }
    default:
      return state
  }
}

export function messageSent(message) {
  return { type: MESSAGE_SENT, payload: message }
}

export function messageReceived(message) {
  return { type: MESSAGE_RECEIVED, payload: message }
}

export * from './async'
