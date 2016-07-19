import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as vis from 'vis'

import * as connectionsActions from 'src/core/connections'
import generateImageUrl from './helpers'
import Stats from './stats'

class Connections extends Component {
  static propTypes = {
    graph: PropTypes.object,
    isGraphProcessed: PropTypes.bool.isRequired,
    processGraphAsync: PropTypes.func.isRequired,
  }

  static defaultProps = {
    graph: {},
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { processGraphAsync } = this.props
    processGraphAsync()
  }

  componentDidUpdate = () => {
    const { isGraphProcessed } = this.props
    if (isGraphProcessed) {
      this.updateGraph()
    }
  }

  processGraph = () => {
    const { graph } = this.props

    graph.nodes = graph.nodes.map(node => {
      node.image = generateImageUrl({ type: node.imageType })
      return node
    })
    return graph
  }

  selectNode = () => {

  }

  updateGraph = () => {
    const container = this._container
    const graph = this.processGraph()

    const options = {
      width: `${container.offsetWidth}px`,
      height: `${container.offsetHeight}px`,
      edges: {
        smooth: {
          forceDirection: 'none',
        }
      },
      physics: {
        barnesHut: {
          centralGravity: 0.75,
          springLength: 40,
          springConstant: 0.41,
          damping: 0.45,
          avoidOverlap: 0.13,
        },
        minVelocity: 0.75,
        timestep: 0.47,
      },
      layout: {},
    }

    this.network = new vis.Network(container, graph, options) // eslint-disable-line no-new
    this.network.on('selectNode', this.selectNode)
  }

  render() {
    return (

      <div className="connections-container">
        <div className="connections-graph" ref={(ref) => this._container = ref} />
        <Stats {...this.props.graph} />
      </div>

    )
  }
}

export default connect(state => ({
  graph: state.connections.graph,
  isGraphProcessed: state.connections.isGraphProcessed,
}), connectionsActions)(Connections)
