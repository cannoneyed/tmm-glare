import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import classnames from 'classnames'

import { notificationActions } from 'src/core/notifications'

import Notification from './notification'

const Notifications = (props) => {
  const {
    notifications,
    theme,
    className,
    CustomComponent,
    dismissNotification,
  } = props

  const items = notifications.map((notification) => {
    return (
      <Notification
        key={notification.id}
        id={notification.id}
        dismissNotification={dismissNotification}
        message={notification.message}
        kind={notification.kind}
        theme={theme}
        CustomComponent={CustomComponent}
      />
    )
  })

  return (
    <div className={classnames('notif-container', className)} >
      <TransitionGroup
        transitionName="notif"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {items}
      </TransitionGroup>
    </div>
  )
}

Notifications.propTypes = {
  CustomComponent: PropTypes.func,
  className: PropTypes.string,
  dismissNotification: PropTypes.func,
  forceNotifsStyles: PropTypes.bool,
  notifications: PropTypes.array.isRequired,
  theme: PropTypes.object,
}

export default connect(state => ({
  notifications: state.notifications,
}), notificationActions)(Notifications)
