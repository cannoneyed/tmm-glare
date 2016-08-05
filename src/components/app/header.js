import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from 'src/core/app'
import { browserHistory } from 'react-router'

import { canGoBack } from 'src/core/history/selectors'
import { hideHeader } from 'src/core/app/selectors'

import Icon from '../shared/icon'

export class Header extends Component {

  static propTypes = {
    canGoBack: PropTypes.bool.isRequired,
    hideHeader: PropTypes.bool.isRequired,
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
      user
    } = this.props

    if (hideHeader) {
      return <header className="header" />
    }

    return (
      <header className="header">
        <span className="header-back" onClick={() => this.goBack()}>
          { canGoBack ? <Icon type={'arrow-back'} size={50} /> : <span /> }
        </span>
        <span className="header-logo" />
        { user ?
          <span className="header-menu" onClick={() => toggleSidebar()}>
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
  user: state.user,
}), {
  toggleSidebar,
})(Header)
