/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'

const UserAvatar = (props) => {
  const { profileImageURL, size, style = {} } = props
  const fallbackUrl = require('src/img/dummy-profile-img.png')

  const avatarStyle = {
    ...style,
    backgroundImage: `url('${profileImageURL}'), url('${fallbackUrl}')`,
  }

  if (size) {
    avatarStyle.width = size
    avatarStyle.height = size
  }

  return (
    <div
      style={avatarStyle}
      className="user-avatar"
    />
  )
}

UserAvatar.propTypes = {
  profileImageURL: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
}

export default UserAvatar
