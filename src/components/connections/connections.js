import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import visLoader from './vis-loader'

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
      vis: null,
    }
  }

  componentWillMount() {
    const { isGraphLoaded, isGraphLoading, loadInitialGraphAsync } = this.props
    // Load the initial user graph (first 2 levels)
    if (!isGraphLoaded && !isGraphLoading) {
      loadInitialGraphAsync()
    }

    visLoader().then(({ vis }) => {
      this.setState({ vis })
    })
  }

  render() {
    const { vis } = this.state
    const { graph } = this.props

    return (
      vis ? <ConnectionsView vis={vis} graph={graph} /> : <Loading />
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
