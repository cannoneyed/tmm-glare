import React from 'react'
import SoundCloudAudio from 'soundcloud-audio'
import classNames from 'classnames'

let { PropTypes } = React

const Progress = (props) => {
  // handleSeekTrack(e) {
  //   let { onSeekTrack, soundCloudAudio } = this.props
  //   const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth
  //
  //
  //   if (soundCloudAudio && !isNaN(soundCloudAudio.audio.duration)) {
  //     soundCloudAudio.audio.currentTime = (xPos * soundCloudAudio.audio.duration)
  //   }
  //
  //   onSeekTrack && onSeekTrack.call(this, xPos, e)
  // }

  const {
    value,
    className,
    innerClassName,
    style,
    innerStyle = {},
    currentTime,
    duration,
    onClick,
  } = props

  let displayValue
  if (!value && currentTime && duration) {
    displayValue = currentTime / duration * 100 || 0
  }

  if (value < 0) {
    displayValue = 0
  }

  if (value > 100) {
    displayValue = 100
  }

  let names = classNames('sb-soundplayer-progress-container', className)
  let innerNames = classNames('sb-soundplayer-progress-inner', innerClassName)

  Object.assign(innerStyle, {width: `${displayValue}%`})

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
