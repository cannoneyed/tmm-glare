import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getConnectionsScore } from 'src/core/selectors/user'

import UserAvatar from 'src/components/shared/userAvatar'

const UserCard = (props) => {
  const {
    hasAccess,
    score,
    user
  } = props

  const avatarStyle = {
    marginBottom: 10,
    paddingRight: 15,
  }

  const scoreSection = (
    <div className="user-stats">
      Score: <span className="user-influence">{score}</span>
    </div>
  )

  return (
    <div className="user-card">
      <UserAvatar profileImageURL={user.profileImageURL} style={avatarStyle} />
      <div className="user-name">{user.displayName}</div>
      { hasAccess ? scoreSection : null }
    </div>
  )
}

UserCard.propTypes = {
  hasAccess: PropTypes.bool,
  score: PropTypes.number,
  user: PropTypes.object,
}

export default connect(state => ({
  hasAccess: state.user && state.user.hasAccess,
  score: getConnectionsScore(state),
  user: state.user,
}), null)(UserCard)
