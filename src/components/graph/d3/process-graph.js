const graph = {
  links: [
    {source: 0, target: 1},
    {source: 0, target: 2},
    {source: 0, target: 3},
    {source: 0, target: 4},
    {source: 0, target: 5},
    {source: 0, target: 6},
    {source: 1, target: 7},
    {source: 2, target: 8},
    {source: 3, target: 9},
    {source: 5, target: 10},
    {source: 5, target: 11},
    {source: 5, target: 12},
    {source: 6, target: 13},
    {source: 6, target: 14},
    {source: 6, target: 15},
    {source: 6, target: 16},
  ],
  nodes: [
    {size: 60, index: 0, name: 'Andy Coenen', type: 'circle', children: [
      { name: 'Molly Larkin'},
    ]},
    {size: 20, index: 1, name: 'Molly Larkin', type: 'circle'},
    {size: 20, index: 2, name: 'Eric Luttrell', type: 'circle'},
    {size: 20, index: 3, name: 'Matt Conrad', type: 'circle'},
    {size: 10, index: 4, name: 'Richard Ferguson', type: 'circle'},
    {size: 40, index: 5, name: 'Luke Davis', type: 'circle'},
    {size: 50, index: 6, name: 'Ben Swardlick', type: 'circle'},
    {size: 20, index: 7, name: 'Catherine Larkin', type: 'circle'},
    {size: 10, index: 8, name: 'Ray Boff', type: 'circle'},
    {size: 10, index: 9, name: 'Mal King', type: 'circle'},
    {size: 10, index: 10, name: 'Henry Wong', type: 'circle'},
    {size: 10, index: 11, name: 'David Ernst', type: 'circle'},
    {size: 10, index: 12, name: 'Spencer Hundley', type: 'circle'},
    {size: 10, index: 13, name: 'Ben Bodkin', type: 'circle'},
    {size: 10, index: 14, name: 'Porter Robinson', type: 'circle'},
    {size: 10, index: 15, name: 'Casey Gray', type: 'circle'},
    {size: 10, index: 16, name: 'Erin Royal', type: 'circle'},
  ],
}
export default () => {
  graph.nodes = graph.nodes.map(node => {
    node.id = node.name
    return node
  })

  return graph
}
