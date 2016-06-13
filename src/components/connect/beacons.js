import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import RippleButton from '../shared/rippleButton'

import { connectActions } from 'src/core/connect'

const Beacons = ({ user, beacons, connectWithUser }) => {
  const hasAccess = user && user.hasAccess

  // Don't render the beacons if the user is not connected
  if (!user.hasAccess) {
    return null
  }

  const handleBeaconClick = (beacon) => {
    connectWithUser(beacon.key)
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

  return (
    <div className="connect-beacons">
      {toRender}
      {beacons.length ? <div className="beacon-divider" /> : null }
    </div>
  )
}

Beacons.propTypes = {
  beacons: PropTypes.array.isRequired,
  connectWithUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default connect(state => ({
  beacons: state.connection.beacons,
  user: state.user,
}), connectActions)(Beacons)
