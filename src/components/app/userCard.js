import React, { PropTypes } from 'react'

export default function UserCard({ user }) {

  const avatarUrl = user.profileImageURL || ''

  const avatarStyle = {
    backgroundImage: `url('${avatarUrl}')`
  }


  const connectionsCount = user && user.connections ?
    Object.keys(user.connections).length : 0

  let connectionsString
  if (connectionsCount === 0) {
    connectionsString = 'No Connections'
  } else if (connectionsCount === 1) {
    connectionsString = '1 Connection'
  } else {
    connectionsString = `${connectionsCount} Connections`
  }

  return (
    <div className="user-card">
      <div
        style={avatarStyle}
        className="user-avatar"
      />
      <div>{user.displayName}</div>
      <div>{connectionsString}</div>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.object,
}
