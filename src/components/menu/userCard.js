import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getConnectionsScore, getRemainingGives } from 'src/core/selectors/user'

const UserCard = (props) => {
  const {
    score,
    user
  } = props

  const avatarUrl = user.profileImageURL || ''

  const avatarStyle = {
    backgroundImage: `url('${avatarUrl}')`
  }

  const scoreString = `Influence: ${score}`

  return (
    <div className="user-card">
      <div
        style={avatarStyle}
        className="user-avatar"
      />
      <div>{user.displayName}</div>
      <div>{scoreString}</div>
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
