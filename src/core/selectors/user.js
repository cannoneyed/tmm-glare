import constants from 'src/constants'

export function getRemainingGives(state) {
  const { user: { connections } } = state

  const remaining = constants.app.maximumGives - Object.keys(connections || {}).length
  return Math.max(0, remaining) // No negative numbers
}
