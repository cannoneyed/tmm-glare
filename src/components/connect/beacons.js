import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import get from 'lodash.get'

import RippleButton from '../shared/rippleButton'
import * as connectActions from 'src/core/connect'
import * as messageActions from 'src/core/messages'
import { hasAskedForAccess, hasBeenAskedForAccess } from 'src/core/selectors/messages'
import ConnectingMessage from './connecting-message'

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

  const giveAccess = (beacon) => {
    connectWithUserAsync(beacon)
  }

  const requestAccess = (beacon) => {
    sendAccessRequestAsync(beacon)
  }

  const toRender = beacons.reverse().filter(beacon => {
    const isConnected = get(user, ['connections', beacon.key].l)
    return !isConnected
  })
  .map((beacon, index) => {
    const hasAsked = hasAskedForAccess(beacon.key, messages)
    const hasBeenAsked = hasBeenAskedForAccess(beacon.key, messages)

    let classNames = classnames({
      'glare-button': true,
      dull: hasBeenAsked,
      highlighted: hasAsked,
    })

    return (
      <RippleButton
        className={classNames}
        key={index}
        onClick={() => {
          if (hasBeenAsked) {
            return
          }
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
      <ConnectingMessage beacons={beacons} hasAccess={hasAccess} />
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
