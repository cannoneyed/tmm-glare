import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'

import Header from './header'
import Footer from './footer'
import Loading from '../loaders/loading'


export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
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

  render() {
    const { children, loading } = this.props
    const toHide = loading ? { display: 'none' } : {}

    return (
      <div className="container">
        <Header />
        {loading ? this.renderLoading() : null}
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
  loading: state.loading,
}), null)(App)
