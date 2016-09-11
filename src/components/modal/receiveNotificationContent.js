import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const GiveNotificationContent = (props) => {
  const { data } = props

  return (
    <h1> FUCK YOU </h1>
  )
}

GiveNotificationContent.propTypes = {
  data: PropTypes.shape({
    connectedUser: PropTypes.shape({
      displayName: PropTypes.string,
      profileImageURL: PropTypes.string,
    })
  })
}

export default connect(null, null)(GiveNotificationContent)
