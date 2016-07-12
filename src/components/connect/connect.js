import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'

import * as globeActions from 'src/core/globe'

import ConnectingLoaderContainer from '../loaders/connecting'
import GlobeContainer from '../globe/globe'

import ListenButton from './listenButton'
import ShareButton from './shareButton'
import Beacons from './beacons'

export class Connect extends Component {

  static propTypes = {
    isConnecting: PropTypes.bool.isRequired,
    isGlobeLoaded: PropTypes.bool.isRequired,
    loadGlobeDataAsync: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  componentWillMount() {
    const { isGlobeLoaded, loadGlobeDataAsync } = this.props
    if (!isGlobeLoaded) {
      loadGlobeDataAsync()
    }
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
        {isGlobeLoaded ? this.renderGlobe() : null}
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
}), globeActions)(Connect)
