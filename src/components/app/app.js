import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'
import Notifications from '../notifications/notifications'

import Sidebar from 'react-sidebar'
import Header from './header'
import Footer from './footer'
import Menu from './menu'

import Loading from '../loaders/loading'

import { addNotification } from 'src/core/notifications'
import { toggleSidebar } from 'src/core/app'

export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    addNotification: PropTypes.func,
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
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

  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open })
  }

  renderLoading = () => {
    return (
      <main className="main">
        <Loading />
      </main>
    )
  }

  renderMain = () => {
    const { children } = this.props
    return (
      <main className="main">
        {children}
        <Notifications />
      </main>
    )
  }

  onClick = () => {
    const { addNotification } = this.props

    addNotification({
      message: 'FUCK YOU!',
      kind: 'success',
      dismissAfter: 5000,
    })
  }

  render() {
    const { isLoading, isSidebarOpen, toggleSidebar } = this.props

    return (
      <Sidebar
        sidebar={<Menu />}
        open={isSidebarOpen}
        onSetOpen={this.onSetSidebarOpen}>
        <div className="container">
          <Header />
          {isLoading ? this.renderLoading() : this.renderMain()}
          <Footer
            setNotification={() => {
              this.onClick()
              toggleSidebar()
            }}
          />
        </div>
      </Sidebar>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  isLoading: state.loading,
  isSidebarOpen: state.app.isSidebarOpen
}), {
  addNotification,
  toggleSidebar,
})(App)
