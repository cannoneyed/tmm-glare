import last from 'lodash.last'

export function canGoBack(history) {
  if (getCurrentPage(history) === 'email') {
    return true
  }

  return history.filter(item => {
    return item !== 'sign-in'
  }).length >= 2
}

export function getCurrentPage(history) {
  return last(history)
}
