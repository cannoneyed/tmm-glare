import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import RippleButton from '../shared/ripple-button'

import { connectActions } from 'src/core/connect'

export class Listen extends Component {

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
      user,
    } = this.props

    const hasAccess = user && user.hasAccess

    return (
      <div className="actionButtons">
        <div className="g-row sign-in">
          <div className="g-col">
            <RippleButton
              onClick={() => {}}>
              {hasAccess ? 'FUCK YOU!' : '...'}
            </RippleButton>
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
}), connectActions)(Listen)
