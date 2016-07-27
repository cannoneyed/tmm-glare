import React, { Component } from 'react'
import visLoader from './vis-loader'

import ConnectionsView from './connections-view'
import Loading from '../loaders/loading'

class Connections extends Component {

  constructor(props) {
    super(props)
    this.state = {
      vis: null,
    }
  }

  componentWillMount() {
    visLoader().then(({ vis }) => {
      this.setState({ vis })
    })
  }

  render() {
    const { vis } = this.state

    return (
      vis ? <ConnectionsView vis={vis} /> : <Loading />
    )
  }
}

export default Connections
