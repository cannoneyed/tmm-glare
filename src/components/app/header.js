import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from 'src/core/app'
import { browserHistory } from 'react-router'

import { canGoBack } from 'src/core/selectors/history'
import { hideHeader } from 'src/core/selectors/app'

import Icon from '../shared/icon'

export class Header extends Component {

  static propTypes = {
    canGoBack: PropTypes.bool.isRequired,
    hideHeader: PropTypes.bool.isRequired,
    isTouchFixed: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
  }

  goBack = () => {
    if (this.props.canGoBack) {
      browserHistory.goBack()
    }
  }

  // When we just want to render an empty block to keep the header aligned properly
  // but not show the menu
  renderDummyMenu() {
    return (
      <span>
        <Icon type={'empty'} size={50} />
      </span>
    )
  }

  render() {
    const {
      canGoBack,
      toggleSidebar,
      hideHeader,
      isTouchFixed,
      user
    } = this.props

    if (hideHeader) {
      return <header className="header" />
    }

    const clickBack = () => this.goBack()
    const clickMenu = () => toggleSidebar()

    // When touch events are being converted to clicks (ie for the connections page),
    // we'll need to use a different handler
    const clickOrTouch = isTouchFixed ? 'onMouseUp' : 'onClick'
    const backButtonHandler = {
      [clickOrTouch]: clickBack
    }
    const menuButtonHandler = {
      [clickOrTouch]: clickMenu
    }

    return (
      <header className="header">
        <span className="header-back" {...backButtonHandler} >
          { canGoBack ? <Icon type={'arrow-back'} size={50} /> : <span /> }
        </span>
        <span className="header-logo" />
        { user ?
          <span
            className="header-menu" {...menuButtonHandler} >
            <Icon type={'menu'} size={50} />
          </span>
        : this.renderDummyMenu() }
      </header>
    )
  }
}

export default connect(state => ({
  canGoBack: canGoBack(state.history),
  hideHeader: hideHeader(state),
  isTouchFixed: state.app.isTouchFixed,
  user: state.user,
}), {
  toggleSidebar,
})(Header)
