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

export function getPreviousPage(history) {
  return history.length > 1 ? history[history.length - 2] : null
}

export function isHomeBackOne(history) {
  return getPreviousPage(history) === 'connect'
}
