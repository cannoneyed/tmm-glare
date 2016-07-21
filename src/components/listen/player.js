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

import {Icon, RippleButton } from '../shared'
import * as loadingActions from 'src/core/loading'
import * as listenActions from 'src/core/listen'

class Player extends Component {
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

  selectTrackAtIndex = (playlistIndex) => {
    const { setSelectedIndex } = this.props
    setSelectedIndex(playlistIndex)
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

  nextIndex = () => {
    let {
      playlist,
      soundCloudAudio,
      activeIndex,
      setSelectedIndex,
      setActiveIndex,
    } = this.props
    if (activeIndex >= playlist.tracks.length - 1) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      setActiveIndex(activeIndex + 1)
      setSelectedIndex(activeIndex + 1)
      soundCloudAudio.next()
    }
  }

  prevIndex = () => {
    let {
      soundCloudAudio,
      activeIndex,
      setActiveIndex,
      setSelectedIndex,
    } = this.props
    if (activeIndex <= 0) {
      return
    }
    if (activeIndex || activeIndex === 0) {
      setActiveIndex(activeIndex - 1)
      setSelectedIndex(activeIndex - 1)
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

  renderTrackButtons = (i) => {
    const { activeIndex, playing } = this.props

    const isPlaying = activeIndex === i && playing
    const iconType = isPlaying ? 'pause' : 'play'
    const playPauseButtonAction = isPlaying ? this.pauseTrack : this.playTrackAtIndex

    return (
      <span className="track-buttons">
        <span
          className="track-button"
          onClick={() => playPauseButtonAction(i)}>
          <Icon type={iconType} size={35} />
        </span>
        <span className="track-button" onClick={() => console.log('launch')}>
          <Icon type="launch" size={25} />
        </span>
      </span>
    )
  }

  renderTrackList = () => {
    let { playlist, activeIndex, selectedIndex } = this.props

    let tracks = playlist.tracks.map((track, i) => {
      const isSelected = selectedIndex === i
      const isActive = activeIndex === i
      let names = classnames('playlist-row', {
        'is-selected': isSelected,
        'is-active': isActive,
      })

      const string = track.title.replace('The M Machine - ', '')
      const pieces = string.split('Ft. ')
      const title = pieces[0]
      const featuring = pieces[1]

      const time = Timer.prettyTime(track.duration / 1000)

      return (
        <RippleButton
          key={track.id}
          className={names}
          onClick={() => this.selectTrackAtIndex(i)}>
          <span className="title">
            { title }
            { featuring ?
              <span className="featuring">{`ft. ${featuring}`}</span> :
              null
            }
          </span>
          { isSelected ?
            this.renderTrackButtons(i) :
            <span className="time">{time}</span>
          }
        </RippleButton>
      )
    })

    return (
      <div>{tracks}</div>
    )
  }

  render() {
    let { currentTime, duration, playlist, activeIndex } = this.props

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
        <div className="player-timer">
          <Progress
            value={currentTime / duration * 100 || 0}
            onClick={this.handleSeekTrack}
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
  activeIndex: state.listen.activeIndex,
  selectedIndex: state.listen.selectedIndex,
}), { ...loadingActions, ...listenActions })(Player)
