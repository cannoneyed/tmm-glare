import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
  PlayButton,
  PrevButton,
  NextButton,
  Progress,
  Timer,
} from './components'

import TrackList from './trackList'

import * as loadingActions from 'src/core/loading'
import * as listenActions from 'src/core/listen'

class Player extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    activeIndex: PropTypes.number,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    playing: PropTypes.bool.isRequired,
    playlist: PropTypes.object,
    selectedIndex: PropTypes.number,
    setActiveIndex: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setSelectedIndex: PropTypes.func.isRequired,
    setTime: PropTypes.func.isRequired,
    soundCloudAudio: PropTypes.object,
  }

  constructor() {
    super()
  }

  onPlayClick = () => {
    const { playing, soundCloudAudio } = this.props
    if (!soundCloudAudio) {
      return
    }

    if (!playing) {
      soundCloudAudio.play({ playlistIndex: soundCloudAudio._playlistIndex })
    } else {
      soundCloudAudio.pause()
    }
  }

  nextIndex = () => {
    let {
      playlist,
      soundCloudAudio,
      activeIndex,
      setSelectedIndex,
      setActiveIndex,
      setTime,
    } = this.props
    if (activeIndex >= playlist.tracks.length - 1) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      setActiveIndex(activeIndex + 1)
      setSelectedIndex(activeIndex + 1)
      setTime(0)
      soundCloudAudio.next()
    }
  }

  prevIndex = () => {
    let {
      soundCloudAudio,
      activeIndex,
      setActiveIndex,
      setSelectedIndex,
      setTime,
    } = this.props
    if (activeIndex <= 0) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      setActiveIndex(activeIndex - 1)
      setSelectedIndex(activeIndex - 1)
      setTime(0)
      soundCloudAudio.previous()
    }
  }

  handleSeekTrack = (e) => {
    let { soundCloudAudio } = this.props
    const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.duration)) {
      soundCloudAudio.audio.currentTime = (xPos * soundCloudAudio.audio.duration)
    }
  }

  renderControls = () => {
    let { activeIndex, duration, playlist } = this.props
    if (!duration && playlist) {
      duration = playlist.tracks[activeIndex].duration / 1000
    }

    return (
      <div className="player-header">
        <div className="player-controls">
          <PrevButton
            className="player-button"
            onClick={this.prevIndex}
            {...this.props}
          />
          <PlayButton
            className="player-button"
            onClick={this.onPlayClick}
            {...this.props}
          />
          <NextButton
            className="player-button"
            onClick={this.nextIndex}
            {...this.props}
          />
        </div>
        <div>
          <Timer duration={duration || 0} {..._.omit(this.props, 'duration')} />
        </div>
      </div>
    )
  }

  renderProgress = (currentTime, duration) => {
    return (
      <div className="player-timer">
        <Progress
          value={currentTime / duration * 100 || 0}
          onClick={this.handleSeekTrack}
          {...this.props}
        />
      </div>
    )
  }

  render() {
    let { currentTime, duration, playlist } = this.props

    if (!playlist) {
      return <div>Loading...</div>
    }

    return (
      <div className="player">
        {this.renderControls()}
        {this.renderProgress(currentTime, duration)}
        <TrackList />
      </div>
    )
  }
}

export default connect(state => ({
  activeIndex: state.listen.activeIndex,
  currentTime: state.listen.currentTime,
  duration: state.listen.duration,
  playing: state.listen.playing,
  selectedIndex: state.listen.selectedIndex,
  soundCloudAudio: state.listen.soundCloudAudio,
}), {
  setActiveIndex: listenActions.setActiveIndex,
  setTime: listenActions.setTime,
  setLoading: loadingActions.setLoading,
  setSelectedIndex: listenActions.setSelectedIndex,
})(Player)
