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
    isTouchFixed: PropTypes.bool.isRequired,
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
    const { unreadJournalCount, user, isTouchFixed } = this.props
    const hasAccess = user && user.hasAccess

    // When touch events are being converted to clicks (ie for the connections page),
    // we'll need to use a different handler
    const clickOrTouch = isTouchFixed ? 'onMouseUp' : 'onClick'
    const hideButtonHandler = { [clickOrTouch]: this.hideSidebar }
    const giveButtonHandler = { [clickOrTouch]: this.linkTo('connect') }
    const listenButtonHandler = { [clickOrTouch]: this.linkTo('listen') }
    const connectionsButtonHandler = { [clickOrTouch]: this.linkTo('connections') }
    const journalButtonHandler = { [clickOrTouch]: this.linkTo('journal') }
    const aboutButtonHandler = { [clickOrTouch]: this.linkTo('about') }
    const signOutButtonHandler = { [clickOrTouch]: this.signOutAsync }
    const unlockButtonHandler = { [clickOrTouch]: this.unlockAllTracks }

    return (
      <div className="sidebar-menu-container">
        <RippleButton
          className="sidebar-menu-item menu-close"
          {...hideButtonHandler}>
          <Icon type={'close'} size={35} />
        </RippleButton>

        { user ?
          <UserCard user={user} />
        : null }

        <RippleButton
          className="sidebar-menu-item"
          {...giveButtonHandler}>
          {hasAccess ? 'Give' : 'Connect'}
          <Icon type={'give'} />
        </RippleButton>

        { hasAccess ?
          <RippleButton
            className="sidebar-menu-item"
            {...listenButtonHandler}>
            Listen
            <Icon type={'listen'} />
          </RippleButton>
        : null }

        { hasAccess ?
          <RippleButton
            className="sidebar-menu-item"
            {...connectionsButtonHandler}>
            Connections
            <Icon type={'connections'} />
          </RippleButton>
        : null }

        { hasAccess ?
          <RippleButton
            className="sidebar-menu-item"
            {...journalButtonHandler}>
            Journal
            { unreadJournalCount ?
              <div className="journal-sidebar-count">{unreadJournalCount}</div> :
              <Icon type={'list'} /> }
          </RippleButton>
        : null }

        <RippleButton
          className="sidebar-menu-item"
          {...aboutButtonHandler}>
          About
          <Icon type={'globe'} />
        </RippleButton>

        <RippleButton
          className="sidebar-menu-item"
          {...signOutButtonHandler}>
          Sign Out
          <Icon type={'sign-out'} />
        </RippleButton>

        {hasAccess ?
          <RippleButton
            className="sidebar-menu-item unlock"
            {...unlockButtonHandler}>
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
  isTouchFixed: state.app.isTouchFixed,
  unreadJournalCount: getUnreadJournalCount(state),
  user: state.user,
}), {
  signOutAsync,
  unlockAllTracks,
  toggleSidebar,
})(Menu)
