import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

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

    return beacons.filter(beacon => {
      const isConnected = _.get(user, ['connections', beacon.key])
      return !isConnected
    })
    .map((beacon, index) => {
      return (
        <button
          className="sign-in__button"
          key={index}
          type="button"
          onClick={() => connectWithUser(beacon.key)}>
          {beacon.displayName}
        </button>
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
      <div className="g-row sign-in">
        <div className="g-col">
          <button
            className="sign-in__button"
            onClick={hasAccess ? () => { /* Go to content */ } : null}
            type="button">
            {hasAccess ? 'GLARE' : '...'}
          </button>
          <button
            className="sign-in__button"
            onClick={isConnecting ? cancelConnecting : beginConnecting}
            type="button">
            {isConnecting ? 'Cancel' : connectMessage}
          </button>
          {isConnecting ? this.renderBeacons(beacons) : null}
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
