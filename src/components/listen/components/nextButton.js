import React from 'react'
import classNames from 'classnames'
import { NextIconSVG } from './icons'

let { PropTypes, Component } = React

class NextButton extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    let { className, style, onClick } = this.props
    let names = classNames('sb-soundplayer-play-btn', className)

    return (
      <span className={names} style={style} onClick={onClick}>
        <NextIconSVG />
      </span>
    )
  }
}

NextButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
}

export default NextButton
