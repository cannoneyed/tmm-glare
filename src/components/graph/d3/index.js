const width = window.innerWidth
const height = window.innerHeight

export default function createGraph({ d3, container, graphData }) {
  const force = d3.layout.force()
    .size([width, height])
    .on('tick', tick)

  const zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on('zoom', resize)

  const svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height)


  const vis = svg.append('g')
    .attr('width', width)
    .attr('height', height)
    .call(zoom)

  let link = vis.selectAll('.link')
  let node = vis.selectAll('.node')

  update()

  function update() {
    const nodes = graphData.nodes
    const links = d3.layout.tree().links(nodes)

    // Restart the force layout.
    force
      .nodes(nodes)
      .links(links)
      .start()

    // Update the links…
    link = link.data(links, (d) => d.target.id )

    // Exit any old links.
    link.exit().remove()

    // Enter any new links.
    link.enter().insert('line', '.node')
      .attr('class', 'link')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    // Update the nodes…
    node = node.data(nodes, (d) => d.id ).style('fill', color)

    // Exit any old nodes.
    node.exit().remove()

    // Enter any new nodes.
    node.enter().append('circle')
      .attr('class', 'node')
      .attr('cx', (d) => d.x )
      .attr('cy', (d) => d.y )
      .attr('r', (d) => Math.sqrt(d.size) / 10 || 4.5 )
      .style('fill', color)
      .on('click', click)
      .call(force.drag)
  }

  function tick() {
    link.attr('x1', (d) => d.source.x )
      .attr('y1', (d) => d.source.y )
      .attr('x2', (d) => d.target.x )
      .attr('y2', (d) => d.target.y )

    node.attr('cx', (d) => d.x )
        .attr('cy', (d) => d.y )
  }

  // Color leaf nodes orange, and packages white or blue.
  function color(d) {
    if (d._children) {
      return '#3182bd'
    } else {
      return d.children ? '#c6dbef' : '#fd8d3c'
    }
  }

  // Toggle children on click.
  function click(d) {
    if (!d3.event.defaultPrevented) {
      console.log('🍕', d)
      update()
    }
  }

  function resize() {
    const trans = d3.event.translate
    const scale = d3.event.scale

    vis.attr('transform', `translate(${trans}) scale(${scale})`)
  }
}
