import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import every from 'lodash.every'
import map from 'lodash.map'

import Stats from './stats'

import * as graphActions from 'src/core/graph'
import selectors from 'src/core/selectors'

import createGraph from './d3'

class GraphView extends Component {
  static propTypes = {
    clearQueue: PropTypes.func.isRequired,
    d3: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    graph: PropTypes.object,
    isGraphLoaded: PropTypes.bool.isRequired,
    loadUserConnections: PropTypes.func.isRequired,
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
    const { isGraphLoaded } = this.props
    const { isGraphProcessed } = this.state

    if (isGraphLoaded && !isGraphProcessed) {
      this.updateGraph()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queue, isQueueEmpty } = nextProps
    const { clearQueue } = this.props

    if (isQueueEmpty) {
      return nextProps
    }

    queue.users.forEach(user => {
      this.state.nodes.add(this.nodeFromUser(user))
    })

    queue.connections.forEach(connection => {
      this.state.edges.add(this.edgeFromConnection(connection))
    })

    clearQueue()
    return nextProps
  }

  componentDidUpdate() {
    const { isGraphLoaded } = this.props
    const { isGraphProcessed } = this.state

    if (isGraphLoaded && !isGraphProcessed) {
      this.updateGraph()
    }
  }

  getConnectionCount = (user) => {
    const { graph, ownId } = this.props

    // Don't show connections for expanded nodes
    if (graph.connections[user.key] && graph.connections[user.key].isExpanded) {
      return 0
    }

    let nConnections = Object.keys(user.connections || {}).length - 1
    if (user.key === ownId) {
      nConnections += 1
    }
    return nConnections
  }

  selectNode = (event) => {
    const { graph } = this.props
    const { lastSelected } = this.state
    const targetNode = event.nodes[0]

    if (targetNode) {
      const user = graph.users[targetNode]
      const connection = graph.connections[targetNode]

      const locationString = connection && connection.city && connection.country ?
        `${connection.city}, ${connection.country}` : ''

      const nConnections = this.getConnectionCount(user)
      const connectionsString = nConnections ?
        `${nConnections} ${nConnections === 1 ? 'connection' : 'connections'}` : ''

      const label = ([
        user.displayName,
        locationString,
        connectionsString,
      ]).filter(msg => msg).join('\n')

      this.state.nodes.update({
        id: targetNode,
        label,
      })

      if (lastSelected) {
        this.state.nodes.update({
          id: lastSelected,
          label: '',
        })
      }

      this.setState({
        lastSelected: targetNode,
      })
    }
  }

  doubleClick = (event) => {
    const targetNode = event.nodes[0]
    if (targetNode) {
      this.expandNode(targetNode)
      this.setState({
        hasDoubleClicked: true,
      })
    }
  }

  expandNode = (targetNode) => {
    const { graph, loadUserConnections } = this.props
    const connections = Object.keys(graph.users[targetNode].connections || {})

    const isExpanded = every(connections, connection => {
      return graph.users[connection]
    })

    if (!isExpanded) {
      loadUserConnections(targetNode)
    }
  }

  nodeFromUser = (user) => {
    return {
      id: user.key,
      shape: 'circularImage',
      image: user.profileImageURL,
      label: '',
      value: Object.keys(user.connections || {}).length,
    }
  }

  edgeFromConnection = (connection) => {
    const { from, to } = connection

    return {
      from,
      to,
    }
  }

  processGraphData = () => {
    const { data } = this.props

    const nodes = map(data.users, this.nodeFromUser)
    const edges = map(data.connections, this.edgeFromConnection)

    this.setState({
      nodes,
      edges,
    })

    return { nodes, edges }
  }

  updateGraph = () => {
    const { d3 } = this.props
    const container = ReactDOM.findDOMNode(this._container)

    const graphData = this.processGraphData()

    this.graph = createGraph({ d3, container, graphData }) // eslint-disable-line no-new

    // this.network.on('selectNode', this.selectNode)
    // this.network.on('doubleClick', this.doubleClick)

    this.setState({
      isGraphProcessed: true,
    })
  }

  render() {
    return (
      <div className="graph-wrapper">
        <div className="graph-container" ref={(ref) => this._container = ref} />
        <Stats />
      </div>

    )
  }
}

export default connect(state => ({
  data: state.graph.data,
  ownId: state.auth.id,
  queue: state.graph.queue,
  isGraphLoaded: state.graph.isGraphLoaded,
  isQueueEmpty: selectors.graph.isQueueEmpty(state),
}), {
  loadUserConnections: graphActions.loadUserConnectionsAsync,
  clearQueue: graphActions.clearQueue,
})(GraphView)
