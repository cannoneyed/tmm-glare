// Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
// Licensed Under MIT (http://opensource.org/licenses/MIT)
//
// React Ripple - Version 1.0.0
//
// Adopted from : https://github.com/nelsoncash/angular-ripple

import React, { PropTypes } from 'react'

class Ripple extends React.Component {

  constructor() {
    super()
    this.state = {
      animate: false,
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let cursorPos = nextProps.cursorPos

    // Prevent Component duplicates do ripple effect at the same time
    if (cursorPos.time !== this.props.cursorPos.time) {
      // If Has Animated, set state to "false" First
      if (this.state.animate) {
        this.setState({ animate: false }, () => {
          this.rippling(cursorPos)
        })
      } else {
        this.rippling(cursorPos)
      }
    }
  }

  rippling = (cursorPos) => {
    // Get the element
    let $ripple = this._button
    let $button = $ripple.parentElement

    let buttonPos = $button.getBoundingClientRect()

    let buttonWidth = $button.offsetWidth
    let buttonHeight = $button.offsetHeight

    // Make a Square Ripple
    let rippleWidthShouldBe = Math.max(buttonHeight, buttonWidth)

    // Make Ripple Position to be center
    let centerize = rippleWidthShouldBe / 2

    this.setState({
      animate: true,
      width: rippleWidthShouldBe,
      height: rippleWidthShouldBe,
      top: cursorPos.top - buttonPos.top - centerize,
      left: cursorPos.left - buttonPos.left - centerize
    })
  }

  render() {
    const style = {
      top: this.state.top + 'px',
      left: this.state.left + 'px',
      width: this.state.width + 'px',
      height: this.state.height + 'px'
    }
    return (
      <div
        ref={ref => this._button = ref}
        className={'Ripple ' + (this.state.animate ? 'is-rippling' : '')}
        style={style}
      />
    )
  }
}

Ripple.propTypes = {
  cursorPos: PropTypes.object,
}

export default Ripple
