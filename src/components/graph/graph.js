import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import visLoader from './vis-loader'

import GraphView from './graph-view'
import Loading from '../loaders/loading'
import * as graphActions from 'src/core/graph'

class Graph extends Component {

  static propTypes = {
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

    return (
      vis ? <GraphView vis={vis} /> : <Loading />
    )
  }
}

export default connect(state => ({
  isGraphLoaded: state.graph.isGraphLoaded,
  isGraphLoading: state.graph.isGraphLoading,
}), {
  loadInitialGraphAsync: graphActions.loadInitialGraphAsync,
})(Graph)
