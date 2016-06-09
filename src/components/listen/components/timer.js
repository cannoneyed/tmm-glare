import React from 'react'
import classnames from 'classnames'

let { PropTypes, Component } = React

class Timer extends Component {
  static prettyTime(time) {
    let hours = Math.floor(time / 3600)
    let mins = '' + Math.floor((time % 3600) / 60)
    let secs = '0' + Math.floor((time % 60))

    mins = mins.substr(mins.length - 1)
    secs = secs.substr(secs.length - 2)

    if (!isNaN(secs)) {
      if (hours) {
        return `${hours}:${mins}:${secs}`
      } else {
        return `${mins}:${secs}`
      }
    } else {
      return '0:00'
    }
  }

  render() {
    let { duration, currentTime, className, style, soundCloudAudio } = this.props
    let names = classnames('sb-soundplayer-timer', className)

    if (!duration && soundCloudAudio.duration) {
      duration = soundCloudAudio.duration
    }

    return (
      <div className={names} style={style}>
        {Timer.prettyTime(currentTime)} / {Timer.prettyTime(duration)}
      </div>
    )
  }
}

Timer.propTypes = {
  className: PropTypes.string,
  currentTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  duration: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  soundCloudAudio: PropTypes.object,
  style: PropTypes.object,
}

Timer.defaultProps = {
  duration: 0,
  currentTime: 0
}

export default Timer
