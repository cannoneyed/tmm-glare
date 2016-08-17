import React, { Component } from 'react'
import d3Loader from './d3-loader'

import ConnectionsView from './connections-view'
import Loading from '../loaders/loading'

class Connections extends Component {

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

    return (
      d3 ? <ConnectionsView d3={d3} /> : <Loading />
    )
  }
}

export default Connections
