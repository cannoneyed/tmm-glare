/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'

import UserAvatar from 'src/components/shared/userAvatar'

const SelectedUser = ({ selectedUser }) => {
  const { profileImageURL } = selectedUser

  return (
    <div className="graph-overlay">
      <div className="graph-user-container">
        { selectedUser.displayName }
        <UserAvatar size={50} profileImageURL={profileImageURL} />
      </div>
    </div>
  )
}

SelectedUser.propTypes = {
  selectedUser: PropTypes.object,
}

export default SelectedUser
