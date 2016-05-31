const authenticatingStateKey = 'tmm_glare_isAuthenticating'
const expireThreshold = 15 * 1000 // 10 second oAuth roundtrip

export function setAuthenticatingStateToken(state) {
  const object = {
    isAuthenticating: state,
    timestamp: new Date()
  }
  localStorage.setItem(authenticatingStateKey, JSON.stringify(object))
}

export function getAuthenticatingState() {
  const object = JSON.parse(localStorage.getItem(authenticatingStateKey))
  if (!object) {
    return false
  }

  const isExpired = getAge(object.timestamp) > expireThreshold

  const isAuthenticating = object.isAuthenticating && !isExpired
  return isAuthenticating
}

function getAge(timestamp) {
  return new Date().getTime() - new Date(timestamp).getTime()
}
