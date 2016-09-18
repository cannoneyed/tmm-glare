import React, { Component, PropTypes} from 'react'
import last from 'lodash.last'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'
import UserCard from './userCard'

import { toggleSidebar } from 'src/core/app'
import { signOutAsync } from 'src/core/auth'
import { beginConnectingAsync } from 'src/core/connect'
import { getUnreadJournalCount } from 'src/core/selectors/journal'


class Menu extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    beginConnectingAsync: PropTypes.func.isRequired,
    history: PropTypes.array,
    isConnecting: PropTypes.bool.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    isTouchFixed: PropTypes.bool.isRequired,
    signOutAsync: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    unreadJournalCount: PropTypes.number.isRequired,
    user: PropTypes.object,
  }

  linkTo = (destination) => {
    const { router } = this.context
    const { toggleSidebar, history } = this.props

    return () => {
      setTimeout(() => {
        if (last(history) !== destination) {
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

  render() {
    const {
      beginConnectingAsync,
      isConnecting,
      isTouchFixed,
      unreadJournalCount,
      user,
    } = this.props
    const hasAccess = user && user.hasAccess

    // When touch events are being converted to clicks (ie for the connections page),
    // we'll need to use a different handler
    const clickOrTouch = isTouchFixed ? 'onMouseUp' : 'onClick'
    const hideButtonHandler = { [clickOrTouch]: this.hideSidebar }
    const giveButtonHandler = { [clickOrTouch]: () => {
      const link = this.linkTo('connect')
      link()
      setTimeout(() => !isConnecting ? beginConnectingAsync() : null, 300)
    }}
    const listenButtonHandler = { [clickOrTouch]: this.linkTo('listen') }
    const graphButtonHandler = { [clickOrTouch]: this.linkTo('graph') }
    const journalButtonHandler = { [clickOrTouch]: this.linkTo('journal') }
    const aboutButtonHandler = { [clickOrTouch]: this.linkTo('about') }
    const signOutButtonHandler = { [clickOrTouch]: this.signOutAsync }

    return (
      <div className="sidebar-menu-container">
        <RippleButton
          className="sidebar-menu-item menu-close"
          {...hideButtonHandler}>
          <Icon type={'close'} size={35} />
        </RippleButton>

        { user ?
          <UserCard />
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
            {...graphButtonHandler}>
            Connections
            <Icon type={'graph'} />
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
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  history: state.history,
  isConnecting: state.connect.isConnecting,
  isSidebarOpen: state.app.isSidebarOpen,
  isTouchFixed: state.app.isTouchFixed,
  unreadJournalCount: getUnreadJournalCount(state),
  user: state.user,
}), {
  signOutAsync,
  toggleSidebar,
  beginConnectingAsync,
})(Menu)
