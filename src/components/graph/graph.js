import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import GraphView from './graph-view'
import Loading from '../loaders/loading'

class Graph extends Component { // eslint-disable-line

  static propTypes = {
    isGraphLoaded: PropTypes.bool.isRequired,
    isGraphLoading: PropTypes.bool.isRequired,
  }

  render() {
    const { isGraphLoaded } = this.props

    return (
      isGraphLoaded ? <GraphView /> : <Loading />
    )
  }
}

export default connect(state => ({
  isGraphLoaded: state.graph.isGraphLoaded,
  isGraphLoading: state.graph.isGraphLoading,
}), null)(Graph)
