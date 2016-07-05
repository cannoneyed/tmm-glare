import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'
import Notifications from '../notifications/notifications'

import Header from './header'
import Footer from './footer'
import Loading from '../loaders/loading'

import { notificationActions } from 'src/core/notifications'

export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    addNotification: PropTypes.func,
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.onClick = this.onClick.bind(this)
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
      <main className="main">
        <Loading />
      </main>
    )
  }

  renderMain() {
    const { children } = this.props
    return (
      <main className="main">
        {children}
        <Notifications />
      </main>
    )
  }

  onClick() {
    const { addNotification } = this.props

    addNotification({
      message: 'FUCK YOU!',
      kind: 'success',
      dismissAfter: 5000,
    })
  }

  render() {
    const { isLoading } = this.props

    return (
      <div className="container">
        <Header />
        {isLoading ? this.renderLoading() : this.renderMain()}
        <Footer setNotification={this.onClick} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  isLoading: state.loading,
}), notificationActions)(App)
