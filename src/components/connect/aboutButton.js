import React, { Component, PropTypes } from 'react'

import { Icon, RippleButton } from '../shared'

export default class AboutButton extends Component { // eslint-disable-line

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    hasAccess: PropTypes.bool.isRequired,
  }

  render() {
    const { router } = this.context

    const onClick = () => setTimeout(() => router.push('/about'), 200)

    return (
      <RippleButton
        className="glare-button"
        onClick={onClick}>
        <Icon type="about" />
        About
      </RippleButton>
    )
  }
}
