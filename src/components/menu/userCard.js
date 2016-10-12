import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getConnectionsScore, getRemainingGives } from 'src/core/selectors/user'

import UserAvatar from 'src/components/shared/userAvatar'

const UserCard = (props) => {
  const {
    remaining,
    score,
    user
  } = props

  const avatarStyle = {
    marginBottom: 10,
    paddingRight: 15,
  }

  return (
    <div className="user-card">
      <UserAvatar profileImageURL={user.profileImageURL} style={avatarStyle} />
      <div className="user-name">{user.displayName}</div>
      <div className="user-stats">
        Influence: <span className="user-influence">{score}</span>
      </div>
      <div className="user-stats">
        Gives Remaining: <span className="user-gives">{remaining}</span>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  remaining: PropTypes.number,
  score: PropTypes.number,
  user: PropTypes.object,
}

export default connect(state => ({
  remaining: getRemainingGives(state),
  score: getConnectionsScore(state),
  user: state.user,
}), null)(UserCard)
