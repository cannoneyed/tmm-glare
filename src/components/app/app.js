import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'

import Header from './header'
import Footer from './footer'


export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
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

  render() {
    const { children } = this.props

    return (
      <div className="container">
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
}), null)(App)
