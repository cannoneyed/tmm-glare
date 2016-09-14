import { appConstants } from 'src/constants'

export function getRemainingGives(state) {
  const { user: { connections, isAdmin } } = state

  const remaining = appConstants.maximumGives - Object.keys(connections || {}).length

  if (isAdmin) {
    return 999
  }

  return Math.max(0, remaining) // No negative numbers
}

export function getConnectionsScore(state) {
  return state.connections.stats.score || 0
}

export function getConnectionsCount(state) {
  return Object.keys(state.user.connections || {}).length
}
