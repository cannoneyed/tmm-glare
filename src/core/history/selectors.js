export function canGoBack(history) {
  return history.filter(item => {
    return item !== 'sign-in'
  }).length >= 2
}
