import React from 'react'
import classNames from 'classnames'
import { PrevIconSVG } from './icons'

let { PropTypes, Component } = React

class PrevButton extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    let { className, style, onClick } = this.props

    let names = classNames(className)

    return (
      <span className={names} style={style} onClick={onClick}>
        <PrevIconSVG />
      </span>
    )
  }
}

PrevButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
}

export default PrevButton
