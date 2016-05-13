import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { connectActions } from 'src/core/connect'

const getConnections = (user) => {
  return _.keys(_.get(user, 'connections')).length > 0
}

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

    const isConnected = getConnections(user)

    return (
      <div className="g-row sign-in">
        <div className="g-col">
          <button
            className="sign-in__button"
            onClick={isConnected ? () => { /* Go to content */ } : null}
            type="button">
            {isConnected ? 'GO' : '...'}
          </button>
          <button
            className="sign-in__button"
            onClick={isConnecting ? cancelConnecting : beginConnecting}
            type="button">
            {isConnecting ? 'Cancel' : 'Connect'}
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
