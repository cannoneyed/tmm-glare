import React from 'react'
import { stopAllOther, addToPlayedStore } from './utils/audioStore.js'
import { connect } from 'react-redux'

import * as listenActions from 'src/core/listen'
import { getNextUnlockedTrack } from 'src/core/listen/selectors'

let { PropTypes, Component } = React

class SoundPlayerContainer extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { soundCloudAudio } = this.props

    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    soundCloudAudio.on('playing', this.onAudioStarted)
    soundCloudAudio.on('timeupdate', this.setCurrentTime)
    soundCloudAudio.on('loadedmetadata', this.setDuration)
    soundCloudAudio.on('seeking', this.onSeekingTrack)
    soundCloudAudio.on('seeked', this.onSeekedTrack)
    soundCloudAudio.on('pause', this.onAudioPaused)
    soundCloudAudio.on('ended', this.onAudioEnded)
  }

  componentWillReceiveProps(nextProps) {
    const {
      resolveUrl,
      setPlaylist,
      soundCloudAudio,
    } = this.props
    const playedBefore = this.props.playing

    function restartIfPlayed() {
      if (playedBefore) {
        soundCloudAudio.play()
      }
    }

    if (resolveUrl !== nextProps.resolveUrl) {
      soundCloudAudio.stop()
      soundCloudAudio.resolve(nextProps.resolveUrl, (data) => {
        setPlaylist(data)
        restartIfPlayed()
      })
    }
  }

  componentWillUnmount() {
    this.props.soundCloudAudio.unbindAll()
  }

  onSeekingTrack = () => {
    const { setSeeking } = this.props
    setSeeking(true)
  }

  onSeekedTrack = () => {
    const { setSeeking } = this.props
    setSeeking(false)
  }

  onAudioStarted = () => {
    const { soundCloudAudio, setPlaying } = this.props

    setPlaying(true)
    stopAllOther(soundCloudAudio.playing)
    addToPlayedStore(soundCloudAudio)
  }

  onAudioPaused = () => {
    const { setPlaying } = this.props
    setPlaying(false)
  }

  onAudioEnded = () => {
    let {
      activeIndex,
      getNextUnlockedTrack,
      playTrackAtIndex,
      setPlaying,
    } = this.props

    const nextUnlockedTrack = getNextUnlockedTrack(activeIndex)

    if (nextUnlockedTrack === null) {
      setPlaying(false)
    } else {
      playTrackAtIndex(nextUnlockedTrack)
    }
  }

  setCurrentTime = () => {
    const { soundCloudAudio, setTime } = this.props
    setTime(soundCloudAudio.audio.currentTime)
  }

  setDuration = () => {
    const { soundCloudAudio, setDuration } = this.props
    setDuration(soundCloudAudio.audio.duration)
  }

  wrapChild = (child) => {
    const { soundCloudAudio } = this.props
    const newProps = Object.assign({}, {
      soundCloudAudio,
    }, this.props)
    return React.cloneElement(child, newProps)
  }

  render() {
    const { children } = this.props

    if (!children) {
      return null
    }

    if (!Array.isArray(children)) {
      const child = children
      return this.wrapChild(child)
    } else {
      return (
        <span>
          {React.Children.map(children, this.wrapChild)}
        </span>
      )
    }
  }
}

SoundPlayerContainer.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  children: PropTypes.node,
  clientId: PropTypes.string,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  getNextUnlockedTrack: PropTypes.func.isRequired,
  playTrackAtIndex: PropTypes.func.isRequired,
  playing: PropTypes.bool.isRequired,
  playlist: PropTypes.object,
  resolveUrl: PropTypes.string,
  seeking: PropTypes.bool.isRequired,
  setDuration: PropTypes.func.isRequired,
  setPlaying: PropTypes.func.isRequired,
  setPlaylist: PropTypes.func.isRequired,
  setSeeking: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  soundCloudAudio: PropTypes.object,
  streamUrl: PropTypes.string,
}

export default connect(state => ({
  ...state.listen,
  getNextUnlockedTrack: getNextUnlockedTrack(state),
}), listenActions)(SoundPlayerContainer)
