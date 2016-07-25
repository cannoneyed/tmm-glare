// Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
// Licensed Under MIT (http://opensource.org/licenses/MIT)
//
// React Ripple - Version 1.0.0
//
// Adopted from : https://github.com/nelsoncash/angular-ripple

import React, { PropTypes } from 'react'
import { Ripple } from './index.js'

class RippleButton extends React.Component {
  constructor() {
    super()
    this.state = {
      cursorPos: {}
    }
  }

  handleClick = (e) => {
    // Get Cursor Position
    let cursorPos = {
      top: e.clientY,
      left: e.clientX,
      time: Date.now()
    }
    this.setState({ cursorPos: cursorPos })
  }

  render() {
    return (
      <button
        className="Ripple-parent"
        onMouseUp={ this.handleClick }
        onTouchend={ this.handleClick } >
        { this.props.children }
        <Ripple cursorPos={ this.state.cursorPos } />
      </button>
    )
  }
}

RippleButton.propTypes = {
  children: PropTypes.node,
}

export default RippleButton
