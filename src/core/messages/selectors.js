import _ from 'lodash'
import { REQUEST_ACCESS } from './index'

// See if a given user key has asked you for access to the album
export function hasAskedForAccess(key, messages) {
  return _.find(messages.sent, message => {
    return message.key === key && message.type === REQUEST_ACCESS
  })
}

// See if a given user key has been asked for access to the album
export function hasBeenAskedForAccess(key, messages) {
  return _.find(messages.received, message => {
    return message.key === key && message.type === REQUEST_ACCESS
  })
}
