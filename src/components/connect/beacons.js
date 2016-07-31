import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import _ from 'lodash'

import RippleButton from '../shared/rippleButton'
import * as connectActions from 'src/core/connect'
import * as messageActions from 'src/core/messages'
import { hasAskedForAccess, hasBeenAskedForAccess } from 'src/core/messages/selectors'

const Beacons = (props) => {
  const {
    beacons,
    connectWithUserAsync,
    isConnecting,
    messages,
    sendAccessRequestAsync,
    user,
  } = props
  const hasAccess = user && user.hasAccess

  const message = connectingMessage(beacons, hasAccess)

  const giveAccess = (beacon) => {
    connectWithUserAsync(beacon)
  }

  const requestAccess = (beacon) => {
    sendAccessRequestAsync(beacon)
  }

  const toRender = beacons.reverse().filter(beacon => {
    const isConnected = _.get(user, ['connections', beacon.key])
    return !isConnected
  })
  .map((beacon, index) => {
    const hasAsked = hasAskedForAccess(beacon.key, messages)
    const hasBeenAsked = hasBeenAskedForAccess(beacon.key, messages)

    let classNames = classnames({
      'glare-button': true,
      dull: hasAsked,
      highlighted: hasBeenAsked,
    })

    return (
      <RippleButton
        className={classNames}
        key={index}
        onClick={() => {
          return hasAccess ? giveAccess(beacon) : requestAccess(beacon)
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
  messages: PropTypes.object.isRequired,
  sendAccessRequestAsync: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default connect(state => ({
  isConnecting: state.connect.isConnecting,
  beacons: state.connect.beacons,
  messages: state.messages,
  user: state.user,
}), {
  connectWithUserAsync: connectActions.connectWithUserAsync,
  sendAccessRequestAsync: messageActions.sendAccessRequestAsync,
})(Beacons)

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
