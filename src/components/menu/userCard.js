import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getConnectionsScore, getRemainingGives } from 'src/core/selectors/user'

import UserAvatar from 'src/components/shared/userAvatar'

const UserCard = (props) => {
  const {
    hasAccess,
    remaining,
    score,
    user
  } = props

  const avatarStyle = {
    marginBottom: 10,
    paddingRight: 15,
  }

  const influence = (
    <div className="user-stats">
      Influence: <span className="user-influence">{score}</span>
    </div>
  )

  const gives = (
    <div className="user-stats">
      Gives Remaining: <span className="user-gives">{remaining}</span>
    </div>
  )

  return (
    <div className="user-card">
      <UserAvatar profileImageURL={user.profileImageURL} style={avatarStyle} />
      <div className="user-name">{user.displayName}</div>
      { hasAccess ? influence : null }
      { hasAccess ? gives : null }
    </div>
  )
}

UserCard.propTypes = {
  hasAccess: PropTypes.bool,
  remaining: PropTypes.number,
  score: PropTypes.number,
  user: PropTypes.object,
}

export default connect(state => ({
  hasAccess: state.user && state.user.hasAccess,
  remaining: getRemainingGives(state),
  score: getConnectionsScore(state),
  user: state.user,
}), null)(UserCard)
