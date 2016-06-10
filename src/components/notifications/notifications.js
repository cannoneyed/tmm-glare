import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import classnames from 'classnames'

import { notificationActions } from 'src/core/notifications'

import Notification from './notification'


const styles = {
  position: 'fixed',
  top: '10px',
  right: 0,
  left: 0,
  zIndex: 1000,
  width: '80%',
  maxWidth: 400,
  margin: 'auto'
}

const Notifications = (props) => {
  const {
    notifications,
    theme,
    className,
    CustomComponent,
    forceNotifsStyles
  } = props

  const items = notifications.map((notification) => {
    return (
      <Notification
        key={notification.id}
        message={notification.message}
        kind={notification.kind}
        theme={theme}
        CustomComponent={CustomComponent}
      />
    )
  })

  const componentStyles = forceNotifsStyles || !theme ? styles : {}
  return (
    <div className={classnames('notif-container', className)} style={componentStyles}>
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
  forceNotifsStyles: PropTypes.bool,
  notifications: PropTypes.array.isRequired,
  theme: PropTypes.object,
}

export default connect(state => ({
  notifications: state.notifications,
}), notificationActions)(Notifications)
