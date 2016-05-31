import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'

import RippleButton from '../shared/ripple-button'

import { connectActions } from 'src/core/connect'

export class Connect extends Component {

  static propTypes = {
    beacons: PropTypes.array.isRequired,
    beginConnecting: PropTypes.func.isRequired,
    cancelConnecting: PropTypes.func.isRequired,
    connectWithUser: PropTypes.func.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }

  renderBeacons(beacons) {
    const { connectWithUser, user } = this.props
    const hasAccess = user && user.hasAccess

    return beacons.reverse().filter(beacon => {
      const isConnected = _.get(user, ['connections', beacon.key])
      return !isConnected
    })
    .map((beacon, index) => {
      return (
        <RippleButton
          className="glare_button"
          key={index}
          onClick={() => {
            return hasAccess ? connectWithUser(beacon.key) : null
          }}>
          {beacon.displayName}
        </RippleButton>
      )
    })
  }

  render() {
    const {
      beacons,
      beginConnecting,
      cancelConnecting,
      isConnecting,
      user,
    } = this.props

    const hasAccess = user && user.hasAccess

    // Decide what to display on the 'connect' button
    let connectMessage
    if (hasAccess) {
      connectMessage = 'Share'
    } else {
      connectMessage = 'Connect'
    }

    return (
      <div className="actionButtons">
        <div className="g-row sign-in">
          <div className="g-col">
            {isConnecting ? this.renderBeacons(beacons) : null}
            <RippleButton
              className="glare_button"
              onClick={isConnecting ? cancelConnecting : beginConnecting}>
              {isConnecting ? 'Cancel' : connectMessage}
            </RippleButton>
            <Link to={'/listen'}>
            <RippleButton
              className="glare_button"
              onClick={() => {
                // browserHistory.push('/listen')
              }}>
              {hasAccess ? 'Listen' : '...'}
            </RippleButton>
            </Link>
          </div>
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
