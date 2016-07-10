import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'

import * as connectActions from 'src/core/connect'

class ShareButton extends Component { // eslint-disable-line

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    beginConnecting: PropTypes.func.isRequired,
    cancelConnecting: PropTypes.func.isRequired,
    hasAccess: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
  }

  render() {
    const {
      beginConnecting,
      cancelConnecting,
      hasAccess,
      isConnecting,
    } = this.props

    const connectIcon = isConnecting ? 'cancel' : 'give'
    const connectMessage = hasAccess ? 'Give' : 'Connect'

    return (
      <RippleButton
        className="glare-button"
        onClick={isConnecting ? cancelConnecting : beginConnecting}>
        <Icon type={connectIcon} />
        {isConnecting ? 'Cancel' : connectMessage}
      </RippleButton>
    )
  }
}

export default connect(state => ({
  isConnecting: state.connection.isConnecting,
  beacons: state.connection.beacons,
  user: state.user,
}), connectActions)(ShareButton)
