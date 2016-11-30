/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import classnames from 'classnames'

import UserAvatar from '../shared/userAvatar'

const Leader = (props) => {
  const { user, index, showBorder } = props

  const outerClasses = classnames({
    'leader': true,
    'bottom-border': showBorder,
  })

  return (
    <div className={outerClasses}>
      <div className="leader-avatar">
        <UserAvatar
          profileImageURL={user.profileImageURL}
          size={70}
        />
      </div>
      <div className="leader-content">
        <div className="leader-name">
          <span className="leader-index">{ index + 1 }:</span>
          { user.displayName }
        </div>
        <div className="leader-score">
          Score: { user.score }
        </div>
      </div>
    </div>
  )
}

Leader.propTypes = {
  index: PropTypes.number.isRequired,
  showBorder: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
}

export default Leader
