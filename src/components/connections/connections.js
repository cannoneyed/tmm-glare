import React, { Component } from 'react'
import visLoader from './vis-loader'

import ConnectionsView from './connections-view'

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
      vis ? <ConnectionsView vis={vis} /> : <div />
    )
  }
}

export default Connections
