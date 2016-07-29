import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as connectionsActions from 'src/core/connections'
import Stats from './stats'

class ConnectionsView extends Component {
  static propTypes = {
    graph: PropTypes.object,
    isGraphLoaded: PropTypes.bool.isRequired,
    loadGraphAsync: PropTypes.func.isRequired,
    ownId: PropTypes.string.isRequired,
    vis: PropTypes.object.isRequired,
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

    this.state.nodes.update({
      id: event.nodes[0],
      // image: generateImageUrl({ type: 'selected' })
    })

    if (lastSelected) {
      this.state.nodes.update({
        id: lastSelected,
        // image: generateImageUrl({ type })
      })
    }

    this.setState({
      lastSelected: event.nodes[0],
    })
  }

  processGraph = () => {
    const { graph, vis } = this.props

    const nodes = new vis.DataSet(graph.nodes.map(node => {
      // node.image = generateImageUrl({ type: node.imageType })
      return node
    }))
    const edges = new vis.DataSet(graph.edges)

    this.setState({
      nodes,
      edges,
    })

    return { nodes, edges }
  }

  updateGraph = () => {
    const { vis } = this.props
    const container = this._container
    const graph = this.processGraph()

    const options = {
      width: `${container.offsetWidth}px`,
      height: `${container.offsetHeight}px`,
      edges: {
        color: 'lightgray',
        smooth: {
          forceDirection: 'none',
        }
      },
      nodes: {
        borderWidth: 4,
        size: 30,
        color: {
          border: '#222222',
          background: '#666666'
        },
        font: {
          color: '#eeeeee',
        },
      },
    }

    this.network = new vis.Network(container, graph, options) // eslint-disable-line no-new
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
}), connectionsActions)(ConnectionsView)
