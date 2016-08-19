import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import createGraph from './graph'

import * as appActions from 'src/core/app'
import Stats from './stats'

class ConnectionsView extends Component {
  static propTypes = {
    d3: PropTypes.object,
    graph: PropTypes.object,
    setTouchFixed: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { graph, d3 } = this.props
    const container = ReactDOM.findDOMNode(this._graph)
    createGraph({ d3, container, graph })
  }

  render() {
    return (
      <div className="connections-container">
        <svg
          className="connections-graph"
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
}), {
  setTouchFixed: appActions.setTouchFixed,
})(ConnectionsView)
