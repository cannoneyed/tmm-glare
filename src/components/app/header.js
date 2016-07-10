import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as authActions from 'src/core/auth'
import { toggleSidebar } from 'src/core/app'

import Icon from '../shared/icon'

export class Header extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
  }

  signOut = () => {
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
    const { auth, user, toggleSidebar } = this.props

    if (!user) {
      return null
    }

    return (
      <header className="header">
        <span className="header-connections" onClick={() => toggleSidebar()}>
          <Icon type={'menu'} />
        </span>
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
}), {
  signOut: authActions.signOut,
  toggleSidebar,
})(Header)
