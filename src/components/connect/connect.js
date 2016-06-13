import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import RippleButton from '../shared/rippleButton'
import Container from '../loaders/connecting'

import { connectActions } from 'src/core/connect'

export class Connect extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    beacons: PropTypes.array.isRequired,
    beginConnecting: PropTypes.func.isRequired,
    cancelConnecting: PropTypes.func.isRequired,
    connectWithUser: PropTypes.func.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }

  renderConnectMessage(displayName) {
    return (
      <span>
        {'Succesfully connected with '}
        <strong>{displayName}</strong>
      </span>
    )
  }

  handleBeaconClick(beacon) {
    const { connectWithUser } = this.props

    connectWithUser(beacon.key).then(() => {
      // const message = this.renderConnectMessage(beacon.displayName)
      // setNotification(message)
    })
  }

  renderBeacons(beacons) {
    const { user } = this.props
    const hasAccess = user && user.hasAccess

    return beacons.reverse().filter(beacon => {
      const isConnected = _.get(user, ['connections', beacon.key])
      return !isConnected
    })
    .map((beacon, index) => {
      return (
        <RippleButton
          className="glare-button"
          key={index}
          onClick={() => {
            return hasAccess ? this.handleBeaconClick(beacon) : null
          }}>
          {beacon.displayName}
        </RippleButton>
      )
    })
  }

  renderConnecting() {
    return (
      <div className="loading-underlay">
        <Container />
      </div>
    )
  }

  renderListenButton() {
    const { user } = this.props
    const { router } = this.context

    const hasAccess = user && user.hasAccess

    // Set defaults
    let content = '...'
    let onClick = () => {}

    if (hasAccess) {
      content = 'Listen'
      onClick = () => setTimeout(() => router.push('/listen'), 200)
    }

    return (
      <RippleButton
        className="glare-button"
        onClick={onClick}>
        {content}
      </RippleButton>
    )
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
      <div className="connect-container">
        {isConnecting ? this.renderConnecting() : null}
        <div className="action-buttons">
          {this.renderBeacons(beacons)}
          <RippleButton
            className="glare-button"
            onClick={isConnecting ? cancelConnecting : beginConnecting}>
            {isConnecting ? 'Cancel' : connectMessage}
          </RippleButton>
          {this.renderListenButton()}
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
