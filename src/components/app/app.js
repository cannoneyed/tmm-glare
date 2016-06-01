import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'

import Header from './header'
import Footer from './footer'
import Loading from '../loaders/loading'
import Connecting from '../loaders/connecting'

export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
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

  renderLoading() {
    return (
      <main className="container">
        <Loading />
      </main>
    )
  }

  renderConnecting() {
    return (
      <main className="container">
        <Connecting />
      </main>
    )
  }

  render() {
    const { children, isLoading, isConnecting } = this.props
    const toHide = isLoading ? { display: 'none' } : {}

    return (
      <div className="container">
        <Header />
        {isLoading ? this.renderLoading() : null}
        {/*{isConnecting ? this.renderConnecting() : null}*/}
        <main className="main" style={toHide}>
          {children}
        </main>
        <Footer />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  isLoading: state.loading,
  isConnecting: state.connection.isConnecting,
}), null)(App)
