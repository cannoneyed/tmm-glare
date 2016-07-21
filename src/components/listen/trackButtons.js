import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Icon } from '../shared'

import * as listenActions from 'src/core/listen'

class TrackButtons extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    activeIndex: PropTypes.number,
    index: PropTypes.number,
    playing: PropTypes.bool.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    soundCloudAudio: PropTypes.object.isRequired,
  }

  playTrackAtIndex = (playlistIndex) => {
    const { soundCloudAudio, setActiveIndex } = this.props
    setActiveIndex(playlistIndex)
    soundCloudAudio.play({ playlistIndex })
  }

  pauseTrack = () => {
    const { soundCloudAudio } = this.props
    soundCloudAudio.pause()
  }

  render() {
    const { activeIndex, playing, index } = this.props
    const { router } = this.context

    const isPlaying = activeIndex === index && playing
    const iconType = isPlaying ? 'pause' : 'play'
    const playPauseButtonAction = isPlaying ? this.pauseTrack : this.playTrackAtIndex

    return (
      <span className="track-buttons">
        <span
          className="track-button"
          onClick={() => playPauseButtonAction(index)}>
          <Icon type={iconType} size={35} />
        </span>
        <span
          className="track-button"
          onClick={() => {
            setTimeout(() => {
              router.push(`/tracks/${index}`)
            }, 300)
          }}>
          <Icon type="launch" size={25} />
        </span>
      </span>
    )
  }
}

export default connect(state => ({
  activeIndex: state.listen.activeIndex,
  soundCloudAudio: state.listen.soundCloudAudio,
  playing: state.listen.playing,
}), { ...listenActions })(TrackButtons)
