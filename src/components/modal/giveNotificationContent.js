import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getRemainingGives } from 'src/core/selectors/user'

const GiveNotificationContent = (props) => {
  const { data: { connectedUser }, remaining } = props

  const avatarUrl = connectedUser.profileImageURL || ''

  const dummyProfileImage = '/img/dummy-profile-img.png'
  const avatarStyle = {
    backgroundImage: `url('${avatarUrl}'), url('${dummyProfileImage}')`
  }

  const remainingMessage = remaining > 0 ?
    `You can give Glare to ${remaining} more ${remaining === 1 ? 'person' : 'people'}` :
    'You\'ve given your last copy. As your network grows, you can give to more people'

  return (
    <div className="give-notification-content">
      <div
        style={avatarStyle}
        className="user-avatar"
      />
      <div className="give-message">
        You gave access to
        <br />
        <span className="give-name">{connectedUser.displayName}</span>
      </div>
      <div className="remaining-message">{remainingMessage}</div>
    </div>
  )
}

GiveNotificationContent.propTypes = {
  data: PropTypes.shape({
    connectedUser: PropTypes.shape({
      displayName: PropTypes.string,
      profileImageURL: PropTypes.string,
    })
  }),
  remaining: PropTypes.number,
}

export default connect(state => ({
  remaining: getRemainingGives(state),
}), null)(GiveNotificationContent)
