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
    this.graphView = createGraph({
      d3,
      container,
      graph,
      expandNode: this.expandNode,
      selectNode: this.selectNode,
    })
  }

  selectNode = (id) => {
  }

  expandNode = (source) => {
    const nodes = [{
      id: Math.random().toString(),
      name: 'DUMMY!',
      size: 10,
      type: 'circle',
      weight: 1,
      fixed: 0,
    }]
    this.graphView.addNodes(source, nodes)
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
