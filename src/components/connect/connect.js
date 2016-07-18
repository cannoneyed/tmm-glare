import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'

import * as globeActions from 'src/core/globe'

import ConnectingLoaderContainer from '../loaders/connecting'
import GlobeContainer from '../globe/globe'

import Intro from '../about/intro'
import ListenButton from './listenButton'
import ShareButton from './shareButton'
import Beacons from './beacons'

export class Connect extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    hasViewedIntro: PropTypes.bool.isRequired,
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

  renderGlobe(blurred) {
    return (
      <div className={`globe-underlay ${blurred ? 'blurred' : null}`}>
        <GlobeContainer />
      </div>
    )
  }


  render() {
    const {
      hasViewedIntro,
      isConnecting,
      isGlobeLoaded,
      user,
    } = this.props

    const hasAccess = user && user.hasAccess

    // If the user has not seen the intro page and is on her first visit, then the user
    // must be redirected to the intro page
    const shouldDisplayIntro = !!user && !user.visits && !hasViewedIntro
    const blurred = !!shouldDisplayIntro

    return (
      <div className="connect-container">
        <ReactCSSTransitionGroup
          transitionName="loader-transition"
          transitionEnterTimeout={750}
          transitionLeaveTimeout={750}>
          {isConnecting ? this.renderConnectingLoader() : null}
        </ReactCSSTransitionGroup>
        {isGlobeLoaded ? this.renderGlobe(blurred) : null}
        { shouldDisplayIntro ? <Intro /> :
          <div className="action-buttons">
            <Beacons />
            <ShareButton hasAccess={hasAccess} />
            <ListenButton hasAccess={hasAccess} />
          </div>
        }
      </div>
    )
  }
}

export default connect(state => ({
  isConnecting: state.connect.isConnecting,
  isGlobeLoaded: state.globe.isLoaded,
  beacons: state.connect.beacons,
  user: state.user,
  hasViewedIntro: state.app.hasViewedIntro,
}), globeActions)(Connect)
