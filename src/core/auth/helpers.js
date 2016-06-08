const authenticatingStateKey = 'tmm_glare_isAuthenticating'
const expireThreshold = 60 * 1000 // 60 second oAuth roundtrip

// Set a local storage authenticating token to indicate whether the app is authenticating on reload
export function setAuthenticatingStateToken(state) {
  const object = {
    isAuthenticating: state,
    timestamp: new Date(),
  }
  localStorage.setItem(authenticatingStateKey, JSON.stringify(object))
}

// Get the value of the local storage authenticating token
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
