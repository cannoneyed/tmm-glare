/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import moment from 'moment'

import UserAvatar from 'src/components/shared/userAvatar'

const SelectedUser = ({ selectedUser }) => {
  const {
    city,
    state,
    country,
    profileImageURL,
    timestamp,
  } = selectedUser

  let locationString
  if (country === 'United States' || country === 'Canada') {
    locationString = `${city}, ${state}`
  } else {
    locationString = `${city}, ${country}`
  }

  const location = city ? (<div>{locationString}</div>) : null

  const dateString = moment(timestamp).format('MMM Do, YYYY')

  return (
    <div className="graph-overlay">
      <div className="graph-user-container">
        <div className="graph-user-avatar">
          <UserAvatar size={50} profileImageURL={profileImageURL} />
        </div>
        <div className="graph-user-info">
          <div className="graph-user-name">{selectedUser.displayName}</div>
          {location}
          <div>{dateString}</div>
        </div>
      </div>
    </div>
  )
}

SelectedUser.propTypes = {
  selectedUser: PropTypes.object,
}

export default SelectedUser
