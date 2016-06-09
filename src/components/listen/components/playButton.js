import React from 'react'
import classNames from 'classnames'
import { PlayIconSVG, PauseIconSVG } from './icons'

let { PropTypes, Component } = React

class PlayButton extends Component {
  shouldComponentUpdate(nextProps) {
    let { playing, seeking } = this.props
    return (
      playing !== nextProps.playing || seeking !== nextProps.seeking
    )
  }

  render() {
    let { playing, seekingIcon, seeking, className, style, onClick } = this.props

    let iconNode
    if (seeking && seekingIcon) {
      iconNode = React.cloneElement(seekingIcon)
    } else if (playing) {
      iconNode = <PauseIconSVG />
    } else {
      iconNode = <PlayIconSVG />
    }

    let names = classNames('sb-soundplayer-play-btn', className)

    return (
      <button type="button" className={names} style={style} onClick={onClick}>
        {iconNode}
      </button>
    )
  }
}

PlayButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  playing: PropTypes.bool,
  seeking: PropTypes.bool,
  seekingIcon: PropTypes.node,
  style: PropTypes.object,
}

PlayButton.defaultProps = {
  playing: false,
  seeking: false
}

export default PlayButton
