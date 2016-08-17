import React, { Component, PropTypes} from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'
import UserCard from './userCard'

import { toggleSidebar } from 'src/core/app'
import { signOutAsync } from 'src/core/auth'
import { unlockAllTracks } from 'src/core/listen'
import { getUnreadJournalCount } from 'src/core/journal/selectors'

class Menu extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    history: PropTypes.array,
    isSidebarOpen: PropTypes.bool.isRequired,
    signOutAsync: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    unlockAllTracks: PropTypes.func.isRequired,
    unreadJournalCount: PropTypes.number.isRequired,
    user: PropTypes.object,
  }

  linkTo = (destination) => {
    const { router } = this.context
    const { toggleSidebar, history } = this.props

    return () => {
      setTimeout(() => {
        if (_.last(history) !== destination) {
          router.push(`/${destination}`)
        }
        toggleSidebar(false)
      }, 300)
    }
  }

  hideSidebar = () => {
    const { toggleSidebar } = this.props
    setTimeout(() => toggleSidebar(false), 300)
  }

  signOutAsync = () => {
    const { signOutAsync, toggleSidebar } = this.props
    setTimeout(() => {
      signOutAsync()
      toggleSidebar(false)
    }, 300)
  }

  unlockAllTracks = () => {
    const { unlockAllTracks, toggleSidebar } = this.props
    setTimeout(() => {
      unlockAllTracks()
      toggleSidebar(false)
    }, 300)
  }

  render() {
    const { unreadJournalCount, user } = this.props
    const hasAccess = user && user.hasAccess

    return (
      <div className="sidebar-menu-container">
        <RippleButton
          className="sidebar-menu-item menu-close"
          onClick={this.hideSidebar}>
          <Icon type={'close'} size={35} />
        </RippleButton>

        { user ?
          <UserCard user={user} />
        : null }

        <RippleButton
          className="sidebar-menu-item"
          onClick={this.linkTo('connect')}>
          {hasAccess ? 'Give' : 'Connect'}
          <Icon type={'give'} />
        </RippleButton>

        { hasAccess ?
          <RippleButton
            className="sidebar-menu-item"
            onClick={this.linkTo('listen')}>
            Listen
            <Icon type={'listen'} />
          </RippleButton>
        : null }

        { hasAccess ?
          <RippleButton
            className="sidebar-menu-item"
            onClick={this.linkTo('connections')}>
            Connections
            <Icon type={'connections'} />
          </RippleButton>
        : null }

        { hasAccess ?
          <RippleButton
            className="sidebar-menu-item"
            onClick={this.linkTo('journal')}>
            Journal
            { unreadJournalCount ?
              <div className="journal-sidebar-count">{unreadJournalCount}</div> :
              <Icon type={'list'} /> }
          </RippleButton>
        : null }

        <RippleButton
          className="sidebar-menu-item"
          onClick={this.linkTo('about')}>
          About
          <Icon type={'globe'} />
        </RippleButton>

        <RippleButton
          className="sidebar-menu-item"
          onClick={this.signOutAsync}>
          Sign Out
          <Icon type={'sign-out'} />
        </RippleButton>

        {hasAccess ?
          <RippleButton
            className="sidebar-menu-item unlock"
            onClick={this.unlockAllTracks}>
            Unlock
            <Icon type={'key'} />
          </RippleButton>
        : null
        }
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  history: state.history,
  isSidebarOpen: state.app.isSidebarOpen,
  unreadJournalCount: getUnreadJournalCount(state),
  user: state.user,
}), {
  signOutAsync,
  unlockAllTracks,
  toggleSidebar,
})(Menu)
