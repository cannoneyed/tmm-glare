import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getConnectionsScore, getRemainingGives } from 'src/core/selectors/user'

import UserAvatar from 'src/components/shared/userAvatar'

const UserCard = (props) => {
  const {
    score,
    user
  } = props

  const scoreString = `Influence: ${score}`

  return (
    <div className="user-card">
      <UserAvatar profileImageURL={user.profileImageURL} />
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
