import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DataSet, Network } from 'vis'

import * as connectionsActions from 'src/core/connections'
import { generateImageUrl } from './helpers'
import Stats from './stats'

class Connections extends Component {
  static propTypes = {
    graph: PropTypes.object,
    isGraphLoaded: PropTypes.bool.isRequired,
    loadGraphAsync: PropTypes.func.isRequired,
    ownId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    graph: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      nodes: [],
      edges: [],
      isGraphProcessed: false,
      lastSelected: null,
    }
  }

  componentDidMount() {
    const { loadGraphAsync, isGraphLoaded } = this.props
    const { isGraphProcessed } = this.state

    if (!isGraphLoaded) {
      loadGraphAsync()
    }

    if (isGraphLoaded && !isGraphProcessed) {
      this.updateGraph()
    }
  }

  componentDidUpdate = () => {
    const { isGraphLoaded } = this.props
    const { isGraphProcessed } = this.state

    if (isGraphLoaded && !isGraphProcessed) {
      this.updateGraph()
    }
  }

  selectNode = (event) => {
    const { lastSelected } = this.state
    const { ownId } = this.props

    this.state.nodes.update({
      id: event.nodes[0],
      image: generateImageUrl({ type: 'selected' })
    })

    if (lastSelected) {
      const type = lastSelected === ownId ? 'me' : 'other'
      this.state.nodes.update({
        id: lastSelected,
        image: generateImageUrl({ type })
      })
    }

    this.setState({
      lastSelected: event.nodes[0],
    })
  }

  processGraph = () => {
    const { graph } = this.props

    const nodes = new DataSet(graph.nodes.map(node => {
      node.image = generateImageUrl({ type: node.imageType })
      return node
    }))
    const edges = new DataSet(graph.edges)

    this.setState({
      nodes,
      edges,
    })

    return { nodes, edges }
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

    this.network = new Network(container, graph, options) // eslint-disable-line no-new
    this.network.on('selectNode', this.selectNode)

    this.setState({
      isGraphProcessed: true,
    })
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
  ownId: state.auth.id,
  graph: state.connections.graph,
  isGraphLoaded: state.connections.isGraphLoaded,
}), connectionsActions)(Connections)
