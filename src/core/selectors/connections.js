export function isQueueEmpty(state) {
  const users = Object.keys(state.connections.queue.users).length
  const connections = Object.keys(state.connections.queue.connections).length

  return !(users || connections)
}
