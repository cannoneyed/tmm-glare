import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import RippleButton from '../shared/rippleButton'
import ConnectingLoaderContainer from '../loaders/connecting'

import ListenButton from './listenButton'
import Beacons from './beacons'

import { connectActions } from 'src/core/connect'

export class Connect extends Component {

  static propTypes = {
    beginConnecting: PropTypes.func.isRequired,
    cancelConnecting: PropTypes.func.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }

  renderConnectingLoader() {
    return (
      <div className="loading-underlay">
        <ConnectingLoaderContainer />
      </div>
    )
  }

  render() {
    const {
      beginConnecting,
      cancelConnecting,
      isConnecting,
      user,
    } = this.props

    const hasAccess = user && user.hasAccess

    // Decide what to display on the 'connect' button
    let connectMessage
    if (hasAccess) {
      connectMessage = 'Give'
    } else {
      connectMessage = 'Connect'
    }

    return (
      <div className="connect-container">
        {isConnecting ? this.renderConnectingLoader() : null}
        <div className="action-buttons">
          <Beacons />
          <RippleButton
            className="glare-button"
            onClick={isConnecting ? cancelConnecting : beginConnecting}>
            {isConnecting ? 'Cancel' : connectMessage}
          </RippleButton>
          <ListenButton hasAccess={hasAccess} />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  isConnecting: state.connection.isConnecting,
  beacons: state.connection.beacons,
  user: state.user,
}), connectActions)(Connect)
