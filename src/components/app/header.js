import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { authActions } from 'src/core/auth'

export class Header extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.signOut = this.signOut.bind(this)
  }

  signOut() {
    this.props.signOut()
    window.location.replace('/')
  }

  renderSignOut() {
    const { user } = this.props
    const displayName = user && user.displayName

    return (
      <ul className="user-pieces">
        <li className="user-piece">{displayName}</li>
        <li className="user-piece">
          <a
            className="user-piece"
            onClick={this.signOut}
            href="#">
            Sign out
          </a>
        </li>
      </ul>
    )
  }

  render() {
    const { auth, user } = this.props

    if (!user) {
      return null
    }

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

    const headerTitle = isLoggedIn ? connectionsString : null

    return (
      <header className="header">
        <span className="header-connections">{headerTitle}</span>
        <span className="header-user">
          {auth.authenticated ? this.renderSignOut() : null}
        </span>
      </header>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  user: state.user,
  isConnecting: state.connection.isConnecting,

}), authActions)(Header)
