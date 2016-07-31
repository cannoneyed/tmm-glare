import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import RippleButton from '../shared/rippleButton'
import * as connectActions from 'src/core/connect'

const Beacons = (props) => {
  const {
    beacons,
    connectWithUserAsync,
    isConnecting,
    user,
  } = props
  const hasAccess = user && user.hasAccess

  const message = connectingMessage(beacons, hasAccess)

  const handleBeaconClick = (beacon) => {
    connectWithUserAsync(beacon)
  }

  const toRender = beacons.reverse().filter(beacon => {
    const isConnected = _.get(user, ['connections', beacon.key])
    return !isConnected
  })
  .map((beacon, index) => {
    return (
      <RippleButton
        className="glare-button"
        key={index}
        onClick={() => {
          return hasAccess ? handleBeaconClick(beacon) : null
        }}>
        {beacon.displayName}
      </RippleButton>
    )
  })

  if (!isConnecting) {
    return null
  }

  return (
    <div className="connect-beacons">
      <div className="connect-message">{message}</div>
      {toRender}
      <div className="beacon-divider" />
    </div>
  )
}

Beacons.propTypes = {
  beacons: PropTypes.array.isRequired,
  connectWithUserAsync: PropTypes.func.isRequired,
  isConnecting: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
}

export default connect(state => ({
  isConnecting: state.connect.isConnecting,
  beacons: state.connect.beacons,
  user: state.user,
}), connectActions)(Beacons)

function connectingMessage(beacons, hasAccess) {
  let message
  if (hasAccess) {
    message = beacons.length ?
      'People to give to' :
      'Finding people to give to...'
  } else {
    message = beacons.length ?
      'People to connect with' :
      'Finding people to connect with...'
  }
  return message
}
