import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'

import * as connectActions from 'src/core/connect'
import selectors from 'src/core/selectors'

class ShareButton extends Component { // eslint-disable-line

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    beginConnectingAsync: PropTypes.func.isRequired,
    cancelConnectingAsync: PropTypes.func.isRequired,
    hasAccess: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
  }

  handleClick = () => {
    const {
      beginConnectingAsync,
      cancelConnectingAsync,
      isConnecting,
    } = this.props

    if (isConnecting) {
      cancelConnectingAsync()
    } else {
      beginConnectingAsync()
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
  user: state.user,
}), {
  beginConnectingAsync: connectActions.beginConnectingAsync,
  cancelConnectingAsync: connectActions.cancelConnectingAsync,
})(ShareButton)
