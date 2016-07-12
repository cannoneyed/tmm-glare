import React, { Component, PropTypes } from 'react'
import { Ripple } from './ripple'

class RippleButton extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
  }

  static defaultProps = {
    onClick: () => {},
    className: '',
    text: '',
  }

  constructor() {
    super()
    this.state = {
      cursorPos: {}
    }
  }

  handleClick(e) {
    // Get Cursor Position
    let cursorPos = {
      top: e.clientY,
      left: e.clientX,
      // Prevent Component duplicates do ripple effect at the same time
      time: Date.now()
    }
    this.setState({ cursorPos: cursorPos })
  }

  render() {
    const { className } = this.props || 'glare-button'

    return (
      <div
        className={`${className} Ripple-parent`}
        onClick={(e) => {
          this.handleClick(e)
          this.props.onClick()
        }}
        onMouseUp={(e) => {
          this.handleClick(e)
          this.props.onClick()
        }}
        onTouchend={(e) => {
          this.handleClick(e)
          this.props.onClick()
        }}>
        {this.props.children}
        <Ripple cursorPos={this.state.cursorPos} />
      </div>
    )
  }
}

export default RippleButton
