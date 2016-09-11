/* eslint-disable camelcase, no-unused-vars */
import processGraph from './process-graph'
import hammer from 'hammerjs'

var w = window.innerWidth
var h = window.innerHeight

var focus_node = null
var highlight_node = null

var text_center = false
var outline = false

var min_score = 0
var max_score = 1

export default function createGraph(params) {
  const {
    container,
    d3,
    expandNode,
    graph,
    selectNode
  } = params

  const graphData = processGraph(graph)

  const color = d3.scale.linear()
    .domain([min_score, (min_score + max_score) / 2, max_score])
    .range(['lime', 'yellow', 'red'])

  const highlight_color = 'blue'
  const highlight_trans = 0.1

  const size = d3.scale.pow().exponent(1)
    .domain([1, 100])
    .range([8, 24])

  const force = d3.layout.force()
    .linkDistance(100)
    .charge(-300)
    .size([w, h])

  const default_node_color = '#ccc'
  const default_link_color = '#888'
  const nominal_base_node_size = 8
  const nominal_text_size = 10
  const max_text_size = 24
  const nominal_stroke = 1.5
  const max_stroke = 4.5
  const max_base_node_size = 36
  const min_zoom = 0.1
  const max_zoom = 7

  const svg = d3.select(container)
  const zoom = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom])
  const g = svg.append('g')

  const linkedByIndex = {}
  graphData.links.forEach(function(d) {
    linkedByIndex[d.source + ',' + d.target] = true
  })

  function isConnected(a, b) {
    return linkedByIndex[a.index + ',' + b.index] || linkedByIndex[b.index + ',' + a.index] || a.index === b.index
  }

  function hasConnections(a) {
    for (var property in linkedByIndex) { // eslint-disable-line
      let s = property.split(',')
      if ((s[0] === a.index || s[1] === a.index) && linkedByIndex[property]) {
        return true
      }
    }
    return false
  }

  force
    .nodes(graphData.nodes)
    .links(graphData.links)

  let link = g.selectAll('.link')
  let node = g.selectAll('.node')

  function start() {
    link = link.data(force.links(), d => d.source.id + '-' + d.target.id )
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke-width', nominal_stroke)
      .style('stroke', function(d) {
        if (isNumber(d.score) && d.score >= 0) {
          return color(d.score)
        } else {
          return default_link_color
        }
      })

    node = node.data(force.nodes(), d => d.id )
      .enter().append('g')
      .attr('class', 'node')
      .on('mousedown', handleTouch)
      .on('touchstart', handleTouch)
      .call(force.drag)

    force.start()
  }

  start()

  function handleTouch() {
    d3.event.stopPropagation()
  }

  node.on('dblclick.zoom', function(d) {
    d3.event.stopPropagation()
    var dcx = (window.innerWidth / 2 - d.x * zoom.scale())
    var dcy = (window.innerHeight / 2 - d.y * zoom.scale())
    zoom.translate([dcx, dcy])
    g.attr('transform', 'translate(' + dcx + ',' + dcy + ')scale(' + zoom.scale() + ')')
  })

  let tocolor = 'fill'
  let towhite = 'stroke'
  if (outline) {
    tocolor = 'stroke'
    towhite = 'fill'
  }

  const circle = node.append('path')
    .attr('d', d3.svg.symbol()
    .size(function(d) {
      return Math.PI * Math.pow(size(d.size) || nominal_base_node_size, 2)
    })
    .type(function(d) {
      return d.type
    }))
    .style(tocolor, function(d) {
      if (isNumber(d.score) && d.score >= 0) {
        return color(d.score)
      } else {
        return default_node_color
      }
    })
    .style('stroke-width', nominal_stroke)
    .style(towhite, 'white')


  const text = g.selectAll('.text')
    .data(graphData.nodes)
    .enter().append('text')
    .attr('dy', '.35em')
    .style('font-size', nominal_text_size + 'px')

  if (text_center) {
    text.text(function(d) {
      return d.name
    })
    .style('text-anchor', 'middle')
  } else {
    text.attr('dx', function(d) {
      return size(d.size) || nominal_base_node_size
    })
    .text(function(d) {
      return '\u2002' + d.name
    })
  }

  let last = 0
  let threshold = 300

  function handleNodeClick(node) {
    focus_node = node
    set_focus(node)
    if (highlight_node === null) {
      set_highlight(node)
    }
    selectNode(node.id)
  }

  function handleNodeDoubleClick(node) {
    expandNode(node)
  }

  node
    .on('mousedown', function(node) {
      d3.event.stopPropagation()

      // Detect a doubleclick
      if (Date.now() - last < threshold) {
        handleNodeDoubleClick(node)
      } else {
        handleNodeClick(node)
      }

      last = Date.now()
    })
    .on('mouseout', function(d) {
      exit_highlight()
    })


  d3.select(window)
    .on('mouseup', function() {
      if (focus_node !== null) {
        focus_node = null
        if (highlight_trans < 1) {
          circle.style('opacity', 1)
          text.style('opacity', 1)
          link.style('opacity', 1)
        }
      }

      if (highlight_node === null) {
        exit_highlight()
      }
    })

  function exit_highlight() {
    highlight_node = null
    if (focus_node === null) {
      svg.style('cursor', 'move')
      if (highlight_color !== 'white') {
        circle.style(towhite, 'white')
        text.style('font-weight', 'normal')
        link.style('stroke', function(o) {
          return (isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color
        })
      }
    }
  }

  function set_focus(d) {
    if (highlight_trans < 1) {
      circle.style('opacity', function(o) {
        return isConnected(d, o) ? 1 : highlight_trans
      })

      text.style('opacity', function(o) {
        return isConnected(d, o) ? 1 : highlight_trans
      })

      link.style('opacity', function(o) {
        return o.source.index === d.index || o.target.index === d.index ? 1 : highlight_trans
      })
    }
  }


  function set_highlight(d) {
    svg.style('cursor', 'pointer')
    if (focus_node !== null) {
      d = focus_node
    }

    highlight_node = d

    if (highlight_color !== 'white') {
      circle.style(towhite, function(o) {
        return isConnected(d, o) ? highlight_color : 'white'
      })
      text.style('font-weight', function(o) {
        return isConnected(d, o) ? 'bold' : 'normal'
      })
      link.style('stroke', function(o) {
        if (o.source.index === d.index || o.target.index === d.index) {
          return highlight_color
        } else {
          if (isNumber(o.score) && o.score >= 0) {
            return color(o.score)
          } else {
            return default_link_color
          }
        }
      })
    }
  }


  zoom.on('zoom', function() {

    var stroke = nominal_stroke
    if (nominal_stroke * zoom.scale() > max_stroke) {
      stroke = max_stroke / zoom.scale()
    }
    link.style('stroke-width', stroke)
    circle.style('stroke-width', stroke)

    var base_radius = nominal_base_node_size
    if (nominal_base_node_size * zoom.scale() > max_base_node_size) {
      base_radius = max_base_node_size / zoom.scale()
    }

    circle.attr('d', d3.svg.symbol()
      .size(function(d) {
        return Math.PI * Math.pow(size(d.size) * base_radius / nominal_base_node_size || base_radius, 2)
      })
      .type(function(d) {
        return d.type
      }))

    if (!text_center) {
      text.attr('dx', function(d) {
        return size(d.size) * base_radius / nominal_base_node_size || base_radius
      })
    }

    var text_size = nominal_text_size
    if (nominal_text_size * zoom.scale() > max_text_size) {
      text_size = max_text_size / zoom.scale()
    }

    text.style('font-size', text_size + 'px')

    g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
  })

  svg.call(zoom)

  resize()

  force.on('tick', function() {
    node.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    text.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

    link.attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })

    node.attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })
  })

  function resize() {
    var width = window.innerWidth, height = window.innerHeight
    svg.attr('width', width).attr('height', height)

    force.size([
      force.size()[0] + (width - w) / zoom.scale(),
      force.size()[1] + (height - h) / zoom.scale(),
    ]).resume()
    w = width
    h = height
  }

  link.style('display', function(d) {
    var flag = vis_by_type(d.source.type)
      && vis_by_type(d.target.type)
      && vis_by_node_score(d.source.score)
      && vis_by_node_score(d.target.score)
      && vis_by_link_score(d.score)

    linkedByIndex[d.source.index + ',' + d.target.index] = flag
    return flag ? 'inline' : 'none'
  })

  node.style('display', function(d) {
    return vis_by_type(d.type)
      && vis_by_node_score(d.score) ? 'inline' : 'none'
  })

  text.style('display', function(d) {
    return vis_by_type(d.type)
      && vis_by_node_score(d.score) ? 'inline' : 'none'
  })

  if (highlight_node !== null) {
    const condition = vis_by_type(highlight_node.type)
      && vis_by_node_score(highlight_node.score)

    if (condition) {
      if (focus_node !== null) {
        set_focus(focus_node)
      }
      set_highlight(highlight_node)
    } else {
      exit_highlight()
    }
  }

  function addNodes(source, toAdd) {
    toAdd.forEach(node => {
      graphData.nodes.push(node)
      graphData.links.push({ source, target: node })
      start()
    })

  }

  return {
    addNodes,
  }
}

function vis_by_type() {
  return true
}

function vis_by_node_score() {
  return true
}

function vis_by_link_score() {
  return true
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
