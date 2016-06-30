import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ConnectingLoaderContainer from '../loaders/connecting'

import ListenButton from './listenButton'
import ShareButton from './shareButton'
import Beacons from './beacons'

export class Connect extends Component {

  static propTypes = {
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
      isConnecting,
      user,
    } = this.props

    const hasAccess = user && user.hasAccess

    return (
      <div className="connect-container">
        {isConnecting ? this.renderConnectingLoader() : null}
        <div className="action-buttons">
          <Beacons />
          <ShareButton hasAccess={hasAccess} />
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
}), null)(Connect)
