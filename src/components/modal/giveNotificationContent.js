import React, { PropTypes } from 'react'

const GiveNotificationContent = (props) => {
  const { data: { connectedUser } } = props

  const avatarUrl = connectedUser.profileImageURL || ''

  const dummyProfileImage = '/img/dummy-profile-img.png'
  const avatarStyle = {
    backgroundImage: `url('${avatarUrl}'), url('${dummyProfileImage}')`
  }

  const trackUnlockedMessage = 'TODO! Notify the user which tracks were unlocked!'

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
      <div className="track-unlocked-message">{trackUnlockedMessage}</div>
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
}

export default GiveNotificationContent
