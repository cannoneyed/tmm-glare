import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import createGraph from './graph'

import * as connectionsActions from 'src/core/connections'
import Stats from './stats'

class ConnectionsView extends Component {
  static propTypes = {
    d3: PropTypes.object,
    graph: PropTypes.object,
  }

  componentDidMount() {
    const { graph, d3 } = this.props
    const container = ReactDOM.findDOMNode(this._graph)
    createGraph({ d3, container, graph })
  }

  handleMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    return (
      <div className="connections-container">
        <svg
          className="connections-graph"
          onMouseDown={this.handleMouseDown}
          ref={(ref) => this._graph = ref}
        />
        <Stats />
      </div>

    )
  }
}

export default connect(state => ({
  ownId: state.auth.id,
  graph: state.connections.graph,
  isGraphLoaded: state.connections.isGraphLoaded,
}), connectionsActions)(ConnectionsView)
