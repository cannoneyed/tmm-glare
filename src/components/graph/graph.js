import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import d3Loader from './d3-loader'

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
      d3: null,
    }
  }

  componentWillMount() {
    const { isGraphLoaded, isGraphLoading, loadInitialGraphAsync } = this.props
    // Load the initial user graph (first 2 levels)
    if (!isGraphLoaded && !isGraphLoading) {
      loadInitialGraphAsync()
    }

    d3Loader().then(({ d3 }) => {
      this.setState({ d3 })
    })
  }

  render() {
    const { d3 } = this.state
    const { isGraphLoaded } = this.props

    return (
      d3 && isGraphLoaded ? <GraphView d3={d3} /> : <Loading />
    )
  }
}

export default connect(state => ({
  isGraphLoaded: state.graph.isGraphLoaded,
  isGraphLoading: state.graph.isGraphLoading,
}), {
  loadInitialGraphAsync: graphActions.loadInitialGraphAsync,
})(Graph)
