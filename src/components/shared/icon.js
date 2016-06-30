import React, { Component, PropTypes } from 'react'

class Icon extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    style: PropTypes.object
  }

  static defaultProps = {
    size: 24
  }

  _mergeStyles(...args) {
    // This is the m function from "CSS in JS" and can be extracted to a mixin
    return Object.assign({}, ...args)
  }

  renderGraphic() {
    switch (this.props.icon) {
      case 'facebook':
        return (
          <g><path d="M20 2h-16c-1.1 0-1.99.9-1.99 2l-.01 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2zm-1 2v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v7h-3v-7h-2v-3h2v-2.5c0-1.93 1.57-3.5 3.5-3.5h2.5z"></path></g>
        )
      case 'give':
        return (
          <g><path d="M11 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7.5-2v5.22c-.31-.14-.64-.22-1-.22-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5V12h2v-2h-3.5zM11 14c-2.67 0-8 1.34-8 4v2h10.76c-.48-.72-.76-1.58-.76-2.5 0-1.18.46-2.26 1.21-3.06-1.17-.29-2.33-.44-3.21-.44z"></path></g>
        )
      case 'listen':
        return (
          <g><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"></path></g>
        )
      case 'cancel':
        return (
          <g><path d="M14.59 8l-2.59 2.59-2.59-2.59-1.41 1.41 2.59 2.59-2.59 2.59 1.41 1.41 2.59-2.59 2.59 2.59 1.41-1.41-2.59-2.59 2.59-2.59-1.41-1.41zm-2.59-6c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
        )
      default:
        return null
    }
  }

  render() {
    let styles = {
      fill: 'currentcolor',
      verticalAlign: 'middle',
      width: this.props.size, // CSS instead of the width attr to support non-pixel units
      height: this.props.size // Prevents scaling issue in IE
    }
    return (
      <svg
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        fit
        style={this._mergeStyles(
          styles,
          this.props.style // This lets the parent pass custom styles
        )}>
          {this.renderGraphic()}
      </svg>
    )
  }
}

export default Icon
