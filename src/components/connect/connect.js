import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'

import ConnectingLoaderContainer from '../loaders/connecting'
import GlobeContainer from '../globe/globe'

import ListenButton from './listenButton'
import ShareButton from './shareButton'
import Beacons from './beacons'

export class Connect extends Component {

  static propTypes = {
    isConnecting: PropTypes.bool.isRequired,
    isGlobeLoaded: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }

  renderConnectingLoader() {
    return (
      <div className="loading-underlay">
        <ConnectingLoaderContainer />
      </div>
    )
  }

  renderGlobe() {
    return (
      <div className="globe-underlay">
        <GlobeContainer />
      </div>
    )
  }


  render() {
    const {
      isConnecting,
      isGlobeLoaded,
      user,
    } = this.props

    const hasAccess = user && user.hasAccess

    return (
      <div className="connect-container">
        <ReactCSSTransitionGroup
          transitionName="loader-transition"
          transitionEnterTimeout={750}
          transitionLeaveTimeout={750}>
          {isConnecting ? this.renderConnectingLoader() : null}
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup
          transitionName="globe-transition"
          transitionEnterTimeout={750}
          transitionLeaveTimeout={750}>
          {isGlobeLoaded ? this.renderGlobe() : null}
        </ReactCSSTransitionGroup>
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
  isGlobeLoaded: state.globe.isLoaded,
  beacons: state.connection.beacons,
  user: state.user,
}), null)(Connect)
