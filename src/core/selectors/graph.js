export function isQueueEmpty(state) {
  const users = Object.keys(state.graph.queue.users).length
  const connections = Object.keys(state.graph.queue.connections).length

  return !(users || connections)
}

export function getSelectedUser(state) {
  return state.graph.users[state.graph.selectedUserId]
}
