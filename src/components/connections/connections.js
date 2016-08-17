import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import d3Loader from './d3-loader'

import ConnectionsView from './connections-view'
import Loading from '../loaders/loading'

class Connections extends Component {

  static propTypes = {
    graph: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      d3: null,
    }
  }

  componentWillMount() {
    d3Loader().then(({ d3 }) => {
      this.setState({ d3 })
    })
  }

  render() {
    const { d3 } = this.state
    const { graph } = this.props

    return (
      d3 ? <ConnectionsView graph={graph} d3={d3} /> : <Loading />
    )
  }
}

export default connect(state => ({
  graph: state.connections.graph,
}), null)(Connections)
