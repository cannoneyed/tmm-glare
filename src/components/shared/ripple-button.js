import React, { Component, PropTypes } from 'react'
import { Ripple } from './ripple'

class RippleButton extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
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
      <button
        className={`${className} Ripple-parent`}
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
      </button>
    )
  }
}

export default RippleButton
