import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST_SIGN_IN_PATH, POST_SIGN_OUT_PATH } from 'src/config'
import { authActions } from 'src/core/auth'


export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.signOut = this.signOut.bind(this)
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

  signOut() {
    this.props.signOut()
    window.location.replace('/')
  }

  renderLogout() {
    const { user } = this.props
    const displayName = user && user.displayName

    return (
      <ul className="header__links">
        <li className="header__link">{displayName}</li>
        <li>
          <a
            className="header__link"
            onClick={this.signOut}
            href="#">
            Sign out
          </a>
        </li>
      </ul>
    )
  }

  render() {
    const {
      auth,
      children,
      user,
    } = this.props

    const isLoggedIn = auth.authenticated

    const connectionsCount = user && user.connections ?
      Object.keys(user.connections).length : 0

    let connectionsString
    if (connectionsCount === 0) {
      connectionsString = 'No Connections'
    } else if (connectionsCount === 1) {
      connectionsString = '1 Connection'
    } else {
      connectionsString = `${connectionsCount} Connections`
    }

    const headerTitle = isLoggedIn ? connectionsString : 'The M Machine - Glare'

    return (
      <div>
        <header className="header">
          <div className="g-row">
            <div className="g-col">
              <h1 className="header__title">{headerTitle}</h1>
                {auth.authenticated ? this.renderLogout() : null}
            </div>
          </div>
        </header>

        <main className="main">{children}</main>
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  user: state.user,
  isConnecting: state.connection.isConnecting,
}), authActions)(App)
