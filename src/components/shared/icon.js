import React, { Component, PropTypes } from 'react'

class Icon extends Component {
  static propTypes = {
    size: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    style: PropTypes.object,
    type: PropTypes.string.isRequired,
  }

  static defaultProps = {
    size: 24
  }

  _mergeStyles(...args) {
    // This is the m function from "CSS in JS" and can be extracted to a mixin
    return Object.assign({}, ...args)
  }

  renderGraphic() {
    switch (this.props.type) {
      case 'facebook':
        return (
          <g><path d="M20 2h-16c-1.1 0-1.99.9-1.99 2l-.01 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2zm-1 2v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v7h-3v-7h-2v-3h2v-2.5c0-1.93 1.57-3.5 3.5-3.5h2.5z"></path></g>
        )
      case 'google':
        return (
          <g><path d="M11.2 8.87c0-1.02-.63-3.02-2.08-3.02-.64 0-1.32.44-1.32 1.67 0 1.18.63 2.93 1.97 2.93.06.01 1.43-.01 1.43-1.58zm-.63 4.94l-.31-.01h-.02c-.26 0-1.15.05-1.82.27-.65.24-1.42.72-1.42 1.7 0 1.08 1.04 2.23 2.96 2.23 1.52 0 2.44-1 2.44-1.97 0-.77-.46-1.24-1.83-2.22zm9.43-11.81h-16c-1.1 0-1.99.9-1.99 2l-.01 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2zm-10.93 17.2c-2.8 0-4.07-1.56-4.07-3.01 0-.45.14-1.59 1.48-2.39.77-.47 1.85-.78 3.14-.91-.19-.25-.34-.55-.34-.99 0-.16.02-.31.05-.46h-.38c-1.97 0-3.15-1.55-3.15-3.04 0-1.73 1.29-3.6 4.11-3.6h4.21l-.34.34-.71.71-.06.06h-.71c.41.42.9 1.12.9 2.16 0 1.4-.74 2.09-1.56 2.73-.16.12-.42.38-.42.72 0 .3.24.5.39.62.13.11.3.22.47.34.81.57 1.92 1.34 1.92 2.88 0 1.77-1.29 3.84-4.93 3.84zm9.93-7.2h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z"></path></g>
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
      case 'menu':
        return (
          <g><path d="M3 18h18v-2h-18v2zm0-5h18v-2h-18v2zm0-7v2h18v-2h-18z"></path></g>
        )
      case 'arrow-back':
        return (
          <g><path d="M15.41 7.41l-1.41-1.41-6 6 6 6 1.41-1.41-4.58-4.59z"></path></g>
        )
      case 'connections':
        return (
          <g><path d="M12 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-6 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7.9c-1.05 0-1.9.85-1.9 1.9s.85 1.9 1.9 1.9c1.05 0 1.9-.85 1.9-1.9s-.85-1.9-1.9-1.9zm6 1.9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
        )
      case 'share':
        return (
          <g><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4v-1.9h-4c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9h-4c-1.71 0-3.1-1.39-3.1-3.1zm4.1 1h8v-2h-8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4v1.9h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
        )
      case 'about':
        return (
          <g><path d="M3 9h14v-2h-14v2zm0 4h14v-2h-14v2zm0 4h14v-2h-14v2zm16 0h2v-2h-2v2zm0-10v2h2v-2h-2zm0 6h2v-2h-2v2z"></path></g>
        )
      case 'close':
        return (
          <g><path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"></path></g>
        )
      case 'sign-out':
        return (
          <g><path d="M10 6l-1.41 1.41 4.58 4.59-4.58 4.59 1.41 1.41 6-6z"></path></g>
        )
      case 'world':
        return (
          <g><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79l4.79 4.79v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1v-2h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></g>
        )
      case 'location':
        return (
          <g><path d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g>
        )
      case 'people':
        return (
          <g><path d="M16 11c1.66 0 2.99-1.34 2.99-3s-1.33-3-2.99-3c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3s-1.33-3-2.99-3c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5v2.5h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45v2.5h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></g>
        )
      case 'email':
        return (
          <g><path d="M20 4h-16c-1.1 0-1.99.9-1.99 2l-.01 12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"></path></g>
        )
      case 'play':
        return (
          <g><path d="M8 5v14l11-7z"></path></g>
        )
      case 'pause':
        return (
          <g><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></g>
        )
      case 'launch':
        return (
          <g><path d="M19 19h-14v-14h7v-2h-7c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zm-5-16v2h3.59l-9.83 9.83 1.41 1.41 9.83-9.83v3.59h2v-7h-7z"></path></g>
        )
      case 'more-horiz':
        return (
          <g><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
        )
      case 'more-vert':
        return (
          <g><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
        )
      case 'list':
        return (
          <g><path d="M3 13h2v-2h-2v2zm0 4h2v-2h-2v2zm0-8h2v-2h-2v2zm4 4h14v-2h-14v2zm0 4h14v-2h-14v2zm0-10v2h14v-2h-14z"></path></g>
        )
      case 'key':
        return (
          <g><path d="M12.65 10c-.82-2.33-3.04-4-5.65-4-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4h4.35v4h4v-4h2v-4h-10.35zm-5.65 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
        )
      case 'chevron-right':
        return (
          <g><path d="M10 6l-1.41 1.41 4.58 4.59-4.58 4.59 1.41 1.41 6-6z"></path></g>
        )
      case 'lock':
        return (
          <g><path d="M18 8h-1v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5v2h-1c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm-6-5.1c1.71 0 3.1 1.39 3.1 3.1v2h-6.1v-2h-.1c0-1.71 1.39-3.1 3.1-3.1zm6 17.1h-12v-10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
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
