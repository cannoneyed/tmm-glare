export function getConnectionsScore(state) {
  return state.graph.stats.score || 0
}

export function getConnectionsCount(state) {
  return Object.keys(state.user.connections || {}).length
}
