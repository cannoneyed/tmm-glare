import React, { Component, PropTypes } from 'react'
import P from 'bluebird'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'
import * as modalActions from 'src/core/modals'

class ReceiveNotificationContent extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    data: PropTypes.shape({
      connectedUser: PropTypes.shape({
        displayName: PropTypes.string,
        profileImageURL: PropTypes.string,
      })
    }),
  }

  onPlayClick = () => {
    const { closeModal } = this.props
    const { router } = this.context

    P.delay(300)
      .then(closeModal)
      .delay(300)
      .then(() => router.push('/listen'))
  }

  render() {
    const { data: { connectedUser } } = this.props

    const avatarUrl = connectedUser.profileImageURL || ''

    const dummyProfileImage = '/img/dummy-profile-img.png'
    const avatarStyle = {
      backgroundImage: `url('${avatarUrl}'), url('${dummyProfileImage}')`
    }

    return (
      <div className="give-notification-content">
        <div
          style={avatarStyle}
          className="user-avatar"
        />
        <div className="give-message">
          You just received the album from
          <br />
          <span className="give-name">{connectedUser.displayName}</span>
        </div>
        <RippleButton
          className="glare-button"
          onClick={this.onPlayClick}>
          <Icon type="play" />
          Play
        </RippleButton>
      </div>
    )
  }
}

export default connect(null, {
  closeModal: modalActions.closeModal,
})(ReceiveNotificationContent)
