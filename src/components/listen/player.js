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
    nextTrack: PropTypes.func.isRequired,
    pauseTrack: PropTypes.func.isRequired,
    playTrackAtIndex: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playlist: PropTypes.object,
    previousTrack: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number,
    setActiveIndex: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setSelectedIndex: PropTypes.func.isRequired,
    soundCloudAudio: PropTypes.object,
    unlockedTracks: PropTypes.array.isRequired,
  }

  constructor() {
    super()
  }

  onPlayClick = () => {
    const {
      activeIndex,
      pauseTrack,
      playTrackAtIndex,
      playing,
      soundCloudAudio,
    } = this.props
    if (!soundCloudAudio) {
      return
    }

    if (!playing) {
      playTrackAtIndex(activeIndex)
    } else {
      pauseTrack()
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
    let {
      activeIndex,
      duration,
      nextTrack,
      playlist,
      previousTrack,
    } = this.props
    if (!duration && playlist) {
      duration = playlist.tracks[activeIndex].duration / 1000
    }

    return (
      <div className="player-header">
        <div className="player-header-top-row">
          <div className="player-controls">
            <PrevButton
              className="player-button"
              onClick={previousTrack}
              {...this.props}
            />
            <PlayButton
              className="player-button"
              onClick={this.onPlayClick}
              {...this.props}
            />
            <NextButton
              className="player-button"
              onClick={nextTrack}
              {...this.props}
            />
          </div>
          <div>
            <Timer duration={duration || 0} {..._.omit(this.props, 'duration')} />
          </div>
        </div>
        {this.renderProgress()}
      </div>
    )
  }

  renderProgress = () => {
    const { currentTime, duration } = this.props
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
    let { playlist } = this.props

    if (!playlist) {
      return <div>Loading...</div>
    }

    return (
      <div className="player">
        {this.renderControls()}
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
  unlockedTracks: state.listen.unlockedTracks,
}), {
  nextTrack: listenActions.nextTrack,
  previousTrack: listenActions.previousTrack,
  setActiveIndex: listenActions.setActiveIndex,
  setLoading: loadingActions.setLoading,
  setSelectedIndex: listenActions.setSelectedIndex,
})(Player)
