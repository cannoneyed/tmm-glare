import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Stats from './stats'
import SelectedUser from './selectedUser'

import * as graphActions from 'src/core/graph'
import * as graphSelectors from 'src/core/selectors/graph'

import createGraph from './create-graph'

class GraphView extends Component {
  static propTypes = {
    isGraphLoaded: PropTypes.bool.isRequired,
    nodes: PropTypes.array.isRequired,
    ownId: PropTypes.string.isRequired,
    selectUser: PropTypes.func.isRequired,
    selectedUser: PropTypes.object,
    unselectUser: PropTypes.func.isRequired,
  }

  static defaultProps = {
    graph: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
      lastSelected: null,
    }
  }

  componentDidMount() {
    const { isGraphLoaded, nodes } = this.props

    if (isGraphLoaded) {
      const container = ReactDOM.findDOMNode(this._container)
      this.graph = createGraph({
        container,
        nodes,
        onClickNode: this.onClickNode,
        onClickOutside: this.onClickOutside,
      })
    }
  }

  onClickNode = (userId) => {
    const { selectUser } = this.props

    selectUser(userId)
  }

  onClickOutside = () => {
    const { unselectUser } = this.props

    unselectUser()
  }

  render() {
    const { selectedUser } = this.props

    return (
      <div className="graph-wrapper">
        <div className="graph-container" ref={(ref) => this._container = ref} />
        { selectedUser ? <SelectedUser selectedUser={selectedUser} /> : <Stats /> }
      </div>
    )
  }
}

export default connect(state => ({
  nodes: state.graph.nodes,
  ownId: state.auth.id,
  isGraphLoaded: state.graph.isGraphLoaded,
  selectedUser: graphSelectors.getSelectedUser(state),
}), {
  loadUserData: graphActions.loadUserDataAsync,
  selectUser: graphActions.selectUserAsync,
  unselectUser: graphActions.unselectUser,
})(GraphView)
