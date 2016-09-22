export const checkIncognito = () => {
  var testKey = '___test___', storage = window.localStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return false
  } catch (error) {
    return true
  }
}
