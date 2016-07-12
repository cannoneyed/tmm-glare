import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from 'src/core/app'
import { browserHistory } from 'react-router'

import { canGoBack } from 'src/core/history/selectors'

import Icon from '../shared/icon'

export class Header extends Component {

  static propTypes = {
    canGoBack: PropTypes.bool.isRequired,
    hasViewedIntro: PropTypes.bool.isRequired,
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

  render() {
    const { canGoBack, toggleSidebar, hasViewedIntro, user } = this.props

    if (!hasViewedIntro) {
      return <header className="header" />
    }

    return (
      <header className="header">
        <span className="header-back" onClick={() => this.goBack()}>
          { canGoBack ? <Icon type={'arrow-back'} size={50} /> : null }
        </span>
        <span className="header-logo" />
        { user ?
          <span className="header-menu" onClick={() => toggleSidebar()}>
            <Icon type={'menu'} size={50} />
          </span>
        : null }
      </header>
    )
  }
}

export default connect(state => ({
  canGoBack: canGoBack(state.history),
  hasViewedIntro: state.app.hasViewedIntro,
  user: state.user,
}), {
  toggleSidebar,
})(Header)
