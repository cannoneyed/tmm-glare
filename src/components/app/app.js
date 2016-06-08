import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'
import NotificationSystem from 'react-notification-system'

import Header from './header'
import Footer from './footer'
import Loading from '../loaders/loading'

import { style as notificationStyle } from './notifications'

export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.notificationSystem = null
    this.setNotification = this.setNotification.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { router } = this.context
    const { auth } = this.props

    if (auth.authenticated && !nextProps.auth.authenticated) {
      router.replace(POST_SIGN_OUT_PATH)
    } else if (!auth.authenticated && nextProps.auth.authenticated) {
      router.replace(POST_SIGN_IN_PATH)
    }
  }

  renderLoading() {
    return (
      <main className="container">
        <Loading />
      </main>
    )
  }

  setNotification(content) {
    this.notificationSystem.addNotification({
      message: content,
      level: 'info',
      position: 'tc',
    })
  }

  render() {
    const { children, isLoading } = this.props
    const toHide = isLoading ? { display: 'none' } : {}

    return (
      <div className="container">
        <Header />
        {isLoading ? this.renderLoading() : null}
        <main className="main" style={toHide}>
          {children}
          <NotificationSystem
            ref={(ref) => this.notificationSystem = ref}
            style={notificationStyle}
          />
        </main>
        <Footer setNotification={this.setNotification} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  isLoading: state.loading,
}), null)(App)
