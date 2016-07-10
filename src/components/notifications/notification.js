import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class Notification extends Component {
  static defaultProps = {
    kind: 'info',
  }

  constructor() {
    super()
  }

  onClick = (event) => {
    const { dismissNotification, id } = this.props
    event.preventDefault()
    dismissNotification(id)
  }

  render() {
    const { theme, kind, CustomComponent } = this.props

    let classes
    let styles = {}
    if (!theme) {
      const stylesPerType = stylesNotification[kind]
      styles = {
        ...stylesNotification.base,
        ...stylesPerType,
      }
    } else {
      classes = classnames('re-notif', theme.defaultClasses, theme[`${kind}Classes`])
    }

    const component = !CustomComponent ?
      <div className={classes} style={styles} onClick={this.onClick}>
        <div>
          <div className="notif-icon" />
          <div className="notif-content">
            <span className="notif-message">{this.props.message}</span>
          </div>
        </div>
      </div>
      :
      <CustomComponent {...this.props} />

    return component
  }
}

const stylesNotification = {
  base: {
    position: 'relative',
    font: '1rem normal Helvetica, sans-serif',
    overflow: 'hidden',
    borderRadius: 4,
    marginBottom: 2,
    maxHeight: 400,
    boxSizing: 'border-box',
    boxShadow: '0 0 1px 1px rgba(10, 10, 11, .125)',
    padding: '1rem',
    textAlign: 'center',
  },

  success: {
    backgroundColor: 'rgba(34, 84, 78, .650)'
  },

  info: {
    backgroundColor: 'rgba(73, 42, 100, .650)'
  },

  warning: {
    backgroundColor: 'rgba(100, 50, 28, .650)'
  },

  danger: {
    backgroundColor: 'rgba(91, 30, 24, .650)'
  }
}

Notification.propTypes = {
  CustomComponent: PropTypes.func,
  action: PropTypes.string,
  dismissAfter: PropTypes.number,
  dismissNotification: PropTypes.func,
  id: PropTypes.number,
  kind: React.PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  message: PropTypes.string.isRequired,
  onActionClick: PropTypes.func,
  onClick: PropTypes.func,
  onDismis: PropTypes.func,
  theme: PropTypes.shape({
    defaultClasses: PropTypes.string,
    successClasses: PropTypes.string,
    infoClasses: PropTypes.string,
    warningClasses: PropTypes.string,
    dangerClasses: PropTypes.string
  })
}

export default Notification
