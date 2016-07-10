import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from 'src/core/app'
import { browserHistory } from 'react-router'

import { canGoBack } from 'src/core/history/selectors'

import Icon from '../shared/icon'

export class Header extends Component {

  static propTypes = {
    canGoBack: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
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
    const { canGoBack, toggleSidebar } = this.props

    return (
      <header className="header">
        <span className="header-back" onClick={() => this.goBack()}>
          { canGoBack ? <Icon type={'arrow-back'} /> : null }
        </span>
        <span className="header-menu" onClick={() => toggleSidebar()}>
          <Icon type={'menu'} />
        </span>
      </header>
    )
  }
}

export default connect(state => ({
  canGoBack: canGoBack(state.history),
}), {
  toggleSidebar,
})(Header)
