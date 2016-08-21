import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import d3Loader from './d3-loader'

import ConnectionsView from './connections-view'
import Loading from '../loaders/loading'
import * as connectionsActions from 'src/core/connections'

class Connections extends Component {

  static propTypes = {
    graph: PropTypes.object,
    isGraphLoaded: PropTypes.bool.isRequired,
    isGraphLoading: PropTypes.bool.isRequired,
    loadInitialGraphAsync: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      d3: null,
    }
  }

  componentWillMount() {
    const { isGraphLoaded, isGraphLoading, loadInitialGraphAsync } = this.props
    // Load the initial user graph (first 2 levels)
    if (!isGraphLoaded && !isGraphLoading) {
      loadInitialGraphAsync()
    }

    // Load d3
    d3Loader().then(({ d3 }) => {
      this.setState({ d3 })
    })
  }

  render() {
    const { d3 } = this.state
    const { graph } = this.props

    return (
      d3 && graph ? <ConnectionsView graph={graph} d3={d3} /> : <Loading />
    )
  }
}

export default connect(state => ({
  graph: state.connections.graph,
  isGraphLoaded: state.connections.isGraphLoaded,
  isGraphLoading: state.connections.isGraphLoading,
}), {
  loadInitialGraphAsync: connectionsActions.loadInitialGraphAsync,
})(Connections)
