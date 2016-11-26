import React, { PropTypes } from 'react'
import { trackTitles } from '../../constants'
import Icon from '../shared/icon'

const GiveNotificationContent = (props) => {
  const { data: { connectedUser, unlocked } } = props

  const avatarUrl = connectedUser.profileImageURL || ''

  const dummyProfileImage = '/img/dummy-profile-img.png'
  const avatarStyle = {
    backgroundImage: `url('${avatarUrl}'), url('${dummyProfileImage}')`
  }

  const unlockedTrackTitles = unlocked.map(index => {
    return trackTitles[index]
  })
  const trackUnlockedMessage = unlocked.length ? (
    <div className="track-unlocked-message">
      <div className="track-unlocked-header">
        <Icon type="unlock" />
        { ` You unlocked ${unlocked.length} ${unlocked.length === 1 ? 'track' : 'tracks'}!` }
      </div>
      {unlockedTrackTitles.map((title, index) => (
        <div key={index} className="track-unlocked-title">
          {title}
        </div>
      ))}
    </div>
  ) : null

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
      {trackUnlockedMessage}
    </div>
  )
}

GiveNotificationContent.propTypes = {
  data: PropTypes.shape({
    connectedUser: PropTypes.shape({
      displayName: PropTypes.string,
      profileImageURL: PropTypes.string,
    }),
    unlocked: PropTypes.array,
  }),
}

export default GiveNotificationContent
