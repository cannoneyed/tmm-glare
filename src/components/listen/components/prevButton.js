import React from 'react'
import classNames from 'classnames'
import SoundCloudAudio from 'soundcloud-audio'
import { PrevIconSVG } from './icons'

let { PropTypes, Component } = React

class PrevButton extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    let { className, style, onClick } = this.props

    let names = classNames('sb-soundplayer-play-btn', className)

    return (
      <button type="button" className={names} style={style} onClick={onClick}>
        <PrevIconSVG />
      </button>
    )
  }
}

PrevButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  soundCloudAudio: PropTypes.instanceOf(SoundCloudAudio),
  style: PropTypes.object,
}

export default PrevButton
