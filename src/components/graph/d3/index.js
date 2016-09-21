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

export default function createGraph({ d3, container, graphData }) {
  graphData.nodes = graphData.nodes.map(node => {
    node.x = window.innerWidth / 4 * Math.random() * 10
    node.y = window.innerHeight / 4 * Math.random() * 10
    return node
  })


  var highlight_color = 'blue'
  var highlight_trans = 0.1

  var size = d3.scale.pow().exponent(1)
    .domain([1, 100])
    .range([8, 24])

  var force = d3.layout.force()
    .linkDistance(100)
    .charge(-300)
    .size([w, h])

  var default_node_color = '#ccc'
  var default_link_color = '#888'
  var nominal_base_node_size = 8
  var nominal_text_size = 10
  var max_text_size = 24
  var nominal_stroke = 1.5
  var max_stroke = 4.5
  var max_base_node_size = 36
  var min_zoom = 0.1
  var max_zoom = 7

  const getSize = (d) => Math.PI * Math.pow(size(d.size) || nominal_base_node_size, 2)
  const getImageSize = (d) => 2 * size(d.size)


  var svg = d3.select(container)
  var zoom = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom])
  var g = svg.append('g')

  var linkedByIndex = {}
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
    .start()

  var link = g.selectAll('.link')
    .data(graphData.links)
    .enter().append('line')
    .attr('class', 'link')
    .style('stroke-width', nominal_stroke)
    .attr('filter', 'url(#blur)')
    .style('stroke', default_link_color)

  var defs = svg.append('defs')

  var filter = defs.append('filter')
      .attr('id', 'blur')
    .append('feGaussianBlur')
      .attr('stdDeviation', 1)

  graphData.nodes.forEach(node => {
    defs.append('svg:pattern')
      .attr('id', node.id)
      .attr('patternContentUnits', 'objectBoundingBox')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('svg:image')
      .attr('xlink:href', node.image)
      .attr('width', 1)
      .attr('height', 1)
      .attr('preserveAspectRatio', 'none')
  })

  var node = g.selectAll('.node')
    .data(graphData.nodes)
    .enter()
    .append('path')
    .attr('d', d3.svg.symbol()
      .size(function(d) {
        return getSize(d)
      })
      .type('circle')
    )
    .style('fill', d => `url(#${d.id})`)
    .style('stroke-width', nominal_stroke)
    .style(towhite, 'white')
    .attr('class', 'node')
    // .attr('filter', 'url(#blur)')
    .on('mousedown', handleTouch)
    .on('touchstart', handleTouch)
    .call(force.drag)

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

  var tocolor = 'fill'
  var towhite = 'stroke'
  if (outline) {
    tocolor = 'stroke'
    towhite = 'fill'
  }

  node
    .on('tap', function(d) {
      set_highlight(d)
    })
    .on('mousedown', function(d) {
      d3.event.stopPropagation()
      focus_node = d
      set_focus(d)
      if (highlight_node === null) {
        set_highlight(d)
      }
    })
    .on('mouseout', function(d) {
      exit_highlight()
    })


  d3.select(window)
    .on('mouseup', function() {
      if (focus_node !== null) {
        focus_node = null
        if (highlight_trans < 1) {
          node.style('opacity', 1)
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
        node.style(towhite, 'white')
        link.style('stroke', default_link_color)
      }
    }
  }

  function set_focus(d) {
    if (highlight_trans < 1) {
      node.style('opacity', function(o) {
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
      node.style(towhite, function(o) {
        return isConnected(d, o) ? highlight_color : 'white'
      })
      link.style('stroke', default_link_color)
    }
  }


  zoom.on('zoom', function() {
    var stroke = nominal_stroke
    if (nominal_stroke * zoom.scale() > max_stroke) {
      stroke = max_stroke / zoom.scale()
    }
    link.style('stroke-width', stroke)
    node.style('stroke-width', stroke)

    var base_radius = nominal_base_node_size
    if (nominal_base_node_size * zoom.scale() > max_base_node_size) {
      base_radius = max_base_node_size / zoom.scale()
    }

    node.attr('d', d3.svg.symbol()
      .size(function(d) {
        return Math.PI * Math.pow(size(d.size) * base_radius / nominal_base_node_size || base_radius, 2)
      })
      .type(function(d) {
        return d.type
      }))

    var text_size = nominal_text_size
    if (nominal_text_size * zoom.scale() > max_text_size) {
      text_size = max_text_size / zoom.scale()
    }

    g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
  })

  svg.call(zoom)

  resize()

  force.on('tick', function() {
    node.attr('transform', function(d) {
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
