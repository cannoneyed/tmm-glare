import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { fixTouchOn, fixTouchOff } from 'src/page/fix-touch'

import createGraph from './graph'

import * as appActions from 'src/core/app'
import Stats from './stats'

class ConnectionsView extends Component {
  static propTypes = {
    d3: PropTypes.object,
    graph: PropTypes.object,
    setTouchFixed: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { setTouchFixed } = this.props
    fixTouchOn()
    return setTouchFixed(true)
  }

  componentDidMount() {
    const { graph, d3 } = this.props
    const container = ReactDOM.findDOMNode(this._graph)
    createGraph({ d3, container, graph })
  }

  componentWillUnmount() {
    const { setTouchFixed } = this.props
    fixTouchOff()
    return setTouchFixed(false)

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
