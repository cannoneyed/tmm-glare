import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'

import * as connectActions from 'src/core/connect'
import * as notificationActions from 'src/core/notifications'
import selectors from 'src/core/selectors'

class ShareButton extends Component { // eslint-disable-line

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    beginConnectingAsync: PropTypes.func.isRequired,
    cancelConnectingAsync: PropTypes.func.isRequired,
    hasAccess: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    remainingGives: PropTypes.number.isRequired,
  }

  handleClick = () => {
    const {
      addNotification,
      beginConnectingAsync,
      cancelConnectingAsync,
      connectionsCount,
      isConnecting,
      remainingGives
    } = this.props

    let action = isConnecting ? cancelConnectingAsync : beginConnectingAsync
    if (remainingGives) {
      action()
    } else {
      addNotification({
        message: `You\'ve given the album ${connectionsCount} times. Wait for your network to grow to give more.`,
        kind: 'warning',
        dismissAfter: 4000,
      })
    }

  }

  render() {
    const {
      hasAccess,
      isConnecting,
    } = this.props

    const connectIcon = isConnecting ? 'cancel' : 'give'
    let connectMessage = hasAccess ? 'Give' : 'Connect'

    return (
      <RippleButton
        className="glare-button"
        onClick={this.handleClick}>
        <Icon type={connectIcon} />
        {isConnecting ? 'Cancel' : connectMessage}
      </RippleButton>
    )
  }
}

export default connect(state => ({
  isConnecting: state.connect.isConnecting,
  beacons: state.connect.beacons,
  connectionsCount: selectors.user.getConnectionsCount(state),
  user: state.user,
  remainingGives: selectors.user.getRemainingGives(state),
}), {
  addNotification: notificationActions.addNotification,
  beginConnectingAsync: connectActions.beginConnectingAsync,
  cancelConnectingAsync: connectActions.cancelConnectingAsync,
})(ShareButton)
