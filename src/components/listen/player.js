import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {
  PlayButton,
  PrevButton,
  NextButton,
  Progress,
} from 'react-soundplayer/components'
import Timer from './timer'

import RippleButton from '../shared/rippleButton'
import { loadingActions } from 'src/core/loading'

class Player extends Component {
  static propTypes = {
    currentTime: PropTypes.number,
    duration: PropTypes.number,
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
    const { setLoading } = this.props
    setLoading(true)
  }

  componentWillReceiveProps(nextProps) {
    const { playlist, setLoading } = nextProps
    if (!this.props.playlist && playlist) {
      setLoading(false)
    }
  }

  playTrackAtIndex(playlistIndex) {
    let { soundCloudAudio } = this.props
    this.setState({activeIndex: playlistIndex})
    soundCloudAudio.play({ playlistIndex })
  }

  nextIndex() {
    let { activeIndex } = this.state
    let { playlist } = this.props
    if (activeIndex >= playlist.tracks.length - 1) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      this.setState({activeIndex: ++activeIndex})
    }
  }

  prevIndex() {
    let { activeIndex } = this.state
    if (activeIndex <= 0) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      this.setState({activeIndex: --activeIndex})
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
              onPrevClick={this.prevIndex.bind(this)}
              {...this.props}
            />
            <PlayButton
              className="player-button"
              {...this.props}
            />
            <NextButton
              className="player-button"
              onNextClick={this.nextIndex.bind(this)}
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
            {...this.props}
          />
        </div>
        {this.renderTrackList()}
      </div>
    )
  }
}

export default connect(null, loadingActions)(Player)
