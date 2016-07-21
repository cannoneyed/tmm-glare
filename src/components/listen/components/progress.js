import React from 'react'
import SoundCloudAudio from 'src/core/listen/soundcloud-audio'
import classNames from 'classnames'

let { PropTypes } = React

const Progress = (props) => {
  const {
    className,
    innerClassName,
    style,
    innerStyle = {},
    currentTime,
    duration,
    onClick,
  } = props

  let { value } = props

  if (!value && currentTime && duration) {
    value = currentTime / duration * 100 || 0
  }

  if (value < 0) {
    value = 0
  }

  if (value > 100) {
    value = 100
  }

  let names = classNames('sb-soundplayer-progress-container', className)
  let innerNames = classNames('sb-soundplayer-progress-inner', innerClassName)

  Object.assign(innerStyle, {width: `${value}%`})

  return (
    <div className={names} style={style} onClick={onClick}>
      <div className={innerNames} style={innerStyle} />
    </div>
  )
}


Progress.propTypes = {
  className: PropTypes.string,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  innerClassName: React.PropTypes.string,
  innerStyle: PropTypes.object,
  onClick: PropTypes.func,
  soundCloudAudio: PropTypes.instanceOf(SoundCloudAudio),
  style: PropTypes.object,
  value: React.PropTypes.number,
}

Progress.defaultProps = {
  value: 0
}

export default Progress
