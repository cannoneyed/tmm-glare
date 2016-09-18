function ConnectionsGraph({ d3, container }) {

  // Add and remove elements on the graph object
  this.addNode = (id) => {
    nodes.push({ id: id })
    update()
  }

  this.removeNode = (id) => {
    var i = 0
    var n = findNode(id)
    while (i < links.length) {
      if ((links[i].source === n) || (links[i].target === n)) {
        links.splice(i, 1)
      } else {
        i++
      }
    }
    nodes.splice(findNodeIndex(id), 1)
    update()
  }

  this.removeLink = (source, target) => {
    for (var i = 0; i < links.length; i++) {
      if (links[i].source.id === source && links[i].target.id === target) {
        links.splice(i, 1)
        break
      }
    }
    update()
  }

  this.removeallLinks = () => {
    links.splice(0, links.length)
    update()
  }

  this.removeAllNodes = () => {
    nodes.splice(0, links.length)
    update()
  }

  this.addLink = (source, target, value) => {
    links.push({
      source: findNode(source),
      target: findNode(target),
      value: value
    })
    update()
  }

  function findNode(id) {
    for (var i in nodes) {
      if (nodes[i].id === id) {
        return nodes[i]
      }
    }
  }

  function findNodeIndex(id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        return i
      }
    }
  }

  // set up the D3 visualisation in the specified element
  var w = 960
  var h = 450

  const color = d3.scale.category10()

  const vis = d3.select(container)
      .append('svg:svg')
      .attr('width', w)
      .attr('height', h)
      .attr('id', 'svg')
      .attr('pointer-events', 'all')
      .attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('perserveAspectRatio', 'xMinYMid')
      .append('svg:g')

  const force = d3.layout.force()

  const nodes = force.nodes()
  const links = force.links()

  function update() {
    const link = vis.selectAll('line')
      .data(links, (d) => {
        return d.source.id + '-' + d.target.id
      })

    link.enter().append('line')
      .attr('id', (d) => {
        return d.source.id + '-' + d.target.id
      })
      .attr('stroke-width', (d) => {
        return d.value / 10
      })
      .attr('class', 'link')

    link.append('title')
      .text((d) => {
        return d.value
      })
    link.exit().remove()

    const node = vis.selectAll('g.node')
      .data(nodes, (d) => {
        return d.id
      })

    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .call(force.drag)

    nodeEnter.append('svg:circle')
        .attr('r', 12)
        .attr('id', (d) => {
          return 'Node;' + d.id
        })
        .attr('class', 'nodeStrokeClass')
        .attr('fill', (d) => {
          return color(d.id)
        })

    nodeEnter.append('svg:text')
        .attr('class', 'textClass')
        .attr('x', 14)
        .attr('y', '.31em')
        .text((d) => {
          return d.id
        })

    node.exit().remove()

    force.on('tick', () => {
      node.attr('transform', (d) => {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

      link
        .attr('x1', (d) => {
          return d.source.x
        })
        .attr('y1', (d) => {
          return d.source.y
        })
        .attr('x2', (d) => {
          return d.target.x
        })
        .attr('y2', (d) => {
          return d.target.y
        })
    })

    // Restart the force layout.
    force
      .gravity(0.01)
      .charge(-80000)
      .friction(0)
      .linkDistance((d) => {
        return d.value * 10
      })
      .size([w, h])
      .start()
  }


  // Make it all go
  update()
}

export function buildD3Graph({ d3, container }) {
  const graph = new ConnectionsGraph({ d3, container })


  graph.addNode('Sophia')
  graph.addNode('Daniel')
  graph.addNode('Ryan')
  graph.addNode('Lila')
  graph.addNode('Suzie')
  graph.addNode('Riley')
  graph.addNode('Grace')
  graph.addNode('Dylan')
  graph.addNode('Mason')
  graph.addNode('Emma')
  graph.addNode('Alex')
  graph.addLink('Alex', 'Ryan', '20')
  graph.addLink('Sophia', 'Ryan', '20')
  graph.addLink('Daniel', 'Ryan', '20')
  graph.addLink('Ryan', 'Lila', '30')
  graph.addLink('Lila', 'Suzie', '20')
  graph.addLink('Suzie', 'Riley', '10')
  graph.addLink('Suzie', 'Grace', '30')
  graph.addLink('Grace', 'Dylan', '10')
  graph.addLink('Dylan', 'Mason', '20')
  graph.addLink('Dylan', 'Emma', '20')
  graph.addLink('Emma', 'Mason', '10')

  return graph
}
