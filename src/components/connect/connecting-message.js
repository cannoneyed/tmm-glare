import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as notificationActions from 'src/core/notifications'

import Icon from '../shared/icon'

class ConnectingMessage extends Component {

  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    beacons: PropTypes.array,
    hasAccess: PropTypes.bool,
  }

  constructor() {
    super()
    this.state = {
      learnMoreMessageIndex: 0,
    }
  }

  learnMoreWasClicked = () => {
    const { learnMoreMessageIndex } = this.state
    this.setState({
      learnMoreMessageIndex: learnMoreMessageIndex ? 0 : 1
    })
  }

  getLearnMoreMessage = () => {
    const { hasAccess } = this.props
    const learnMoreMessages = {
      aboutGiving: [
        'To give someone the album, they must sign in to glare.fm and press "Connect"',
        'Remember, they must be nearby and you both must enable geolocation'
      ],
      aboutGetting: [
        'To get the album, someone who already has access on glare.fm must give it to you.',
        'Remember, they must be nearby and you both must enable geolocation',
      ],
    }

    const messages = hasAccess ?
      learnMoreMessages.aboutGiving : learnMoreMessages.aboutGetting

    return messages[this.state.learnMoreMessageIndex]
  }

  render() {
    const {
      addNotification,
      beacons,
      hasAccess,
    } = this.props

    let message
    let learnMore = !beacons.length

    if (hasAccess) {
      message = beacons.length ?
        'People to give the album to' :
        'Finding people to give to...'
    } else {
      message = beacons.length ?
        'People to connect with' :
        'Finding people to get the album from...'
    }

    const learnMoreNotificationContent = (
      <span>
        <Icon type="give" size={20} /><Icon type="empty" size={10} />
        <br />
        { this.getLearnMoreMessage() }
      </span>
    )

    const onClick = () => {
      if (!learnMore) {
        return
      }

      addNotification({
        message: learnMoreNotificationContent,
        kind: 'info',
        dismissAfter: 4000,
      })

      this.learnMoreWasClicked()
    }

    return (
      <div className="connect-message" onClick={onClick}>
          { message }
          { learnMore ?
            <div className="connect-learn-more">Learn More</div> :
            null
          }
      </div>
    )
  }
}

export default connect(null, {
  addNotification: notificationActions.addNotification,
})(ConnectingMessage)
