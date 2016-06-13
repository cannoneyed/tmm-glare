import React, { Component, PropTypes } from 'react'

import RippleButton from '../shared/rippleButton'

export default class ListenButton extends Component { // eslint-disable-line

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    hasAccess: PropTypes.bool.isRequired,
  }

  render() {
    const { hasAccess } = this.props
    const { router } = this.context

    // Set defaults
    let content = '...'
    let onClick = () => {}

    if (hasAccess) {
      content = 'Listen'
      onClick = () => setTimeout(() => router.push('/listen'), 200)
    }

    return (
      <RippleButton
        className="glare-button"
        onClick={onClick}>
        {content}
      </RippleButton>
    )
  }
}
