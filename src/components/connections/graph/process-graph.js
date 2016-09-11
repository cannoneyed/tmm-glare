export default (graph) => {
  const idsToIndex = {}
  const output = {
    links: [],
    nodes: [],
  }

  graph.nodes().forEach((id, index) => {
    idsToIndex[id] = index
    const node = graph.node(id)
    output.nodes.push({
      id,
      name: node.displayName,
      size: Object.keys(node.connections || {}).length * 10 + 10,
      type: 'circle',
    })
  })

  graph.edges().forEach(edge => {
    const { w, v } = edge
    output.links.push({
      source: idsToIndex[v],
      target: idsToIndex[w],
    })
  })

  return output
}
