import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {
  PlayButton,
  PrevButton,
  NextButton,
  Progress,
  Timer,
} from './components'

import RippleButton from '../shared/rippleButton'
import { loadingActions } from 'src/core/loading'

class Player extends Component {
  static propTypes = {
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    playing: PropTypes.bool.isRequired,
    playlist: PropTypes.object,
    setLoading: PropTypes.func.isRequired,
    soundCloudAudio: PropTypes.object,
  }

  constructor() {
    super()

    this.state = {
      activeIndex: 0
    }
  }

  componentWillMount() {
    const { playlist, setLoading } = this.props
    if (!playlist) {
      setLoading(true)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playlist, setLoading } = nextProps
    if (!this.props.playlist && playlist) {
      setLoading(false)
    }
  }

  onPlayClick() {
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

  playTrackAtIndex(playlistIndex) {
    let { soundCloudAudio } = this.props
    this.setState({activeIndex: playlistIndex})
    soundCloudAudio.play({ playlistIndex })
  }

  nextIndex() {
    let { activeIndex } = this.state
    let { playlist, soundCloudAudio } = this.props
    if (activeIndex >= playlist.tracks.length - 1) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      this.setState({activeIndex: ++activeIndex})
      soundCloudAudio.next()
    }
  }

  prevIndex() {
    let { activeIndex } = this.state
    const { soundCloudAudio } = this.props
    if (activeIndex <= 0) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      this.setState({activeIndex: --activeIndex})
      soundCloudAudio.previous()
    }
  }

  handleSeekTrack(e) {
    let { soundCloudAudio } = this.props
    const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth


    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.duration)) {
      soundCloudAudio.audio.currentTime = (xPos * soundCloudAudio.audio.duration)
    }
  }

  renderTrackList() {
    let { playlist } = this.props

    let tracks = playlist.tracks.map((track, i) => {
      let names = classnames('playlist-row', {
        'is-active': this.state.activeIndex === i
      })

      const title = track.title.replace('The M Machine - ', '')
      const time = Timer.prettyTime(track.duration / 1000)

      return (
        <RippleButton
          key={track.id}
          className={names}
          onClick={this.playTrackAtIndex.bind(this, i)}>
          <span className="title">{title}</span>
          <span className="time">{time}</span>
        </RippleButton>
      )
    })

    return (
      <div>{tracks}</div>
    )
  }

  render() {
    let { currentTime, duration, playlist } = this.props
    let { activeIndex } = this.state
    if (!duration && playlist) {
      duration = playlist.tracks[activeIndex].duration / 1000
    }

    if (!playlist) {
      return <div>Loading...</div>
    }

    return (
      <div className="player">
        <div className="player-header">
          <div className="player-controls">
            <PrevButton
              className="player-button"
              onClick={this.prevIndex.bind(this)}
              {...this.props}
            />
            <PlayButton
              className="player-button"
              onClick={this.onPlayClick.bind(this)}
              {...this.props}
            />
            <NextButton
              className="player-button"
              onClick={this.nextIndex.bind(this)}
              {...this.props}
            />
          </div>
          <div>
            <Timer duration={duration || 0} {..._.omit(this.props, 'duration')} />
          </div>
        </div>
        <div className="player-timer">
          <Progress
            value={currentTime / duration * 100 || 0}
            onClick={this.handleSeekTrack.bind(this)}
            {...this.props}
          />
        </div>
        {this.renderTrackList()}
      </div>
    )
  }
}

export default connect(state => ({
  playing: state.listen.playing,
  soundCloudAudio: state.listen.soundCloudAudio,
  currentTime: state.listen.currentTime,
  duration: state.listen.duration,
}), loadingActions)(Player)
