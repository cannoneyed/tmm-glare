import _ from 'lodash'

export function canGoBack(history) {
  if (getCurrentPage(history) === 'email') {
    return true
  }

  return history.filter(item => {
    return item !== 'sign-in'
  }).length >= 2
}

export function getCurrentPage(history) {
  return _.last(history)
}