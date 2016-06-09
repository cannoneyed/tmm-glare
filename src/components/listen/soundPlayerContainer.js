import React from 'react'
import { stopAllOther, addToPlayedStore } from './utils/audioStore.js'
import { connect } from 'react-redux'

import { listenActions } from 'src/core/listen'

let { PropTypes, Component } = React

class SoundPlayerContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.wrapChild = this.wrapChild.bind(this)
  }

  componentDidMount() {
    const {
      setPlaylist,
      resolveUrl,
      soundCloudAudio,
      streamUrl,
    } = this.props

    if (streamUrl) {
      soundCloudAudio.preload(streamUrl)
    } else if (resolveUrl) {
      soundCloudAudio.resolve(resolveUrl, (data) => {
        setPlaylist(data)
      })
    }

    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    soundCloudAudio.on('playing', this.onAudioStarted.bind(this))
    soundCloudAudio.on('timeupdate', this.getCurrentTime.bind(this))
    soundCloudAudio.on('loadedmetadata', this.getDuration.bind(this))
    soundCloudAudio.on('seeking', this.onSeekingTrack.bind(this))
    soundCloudAudio.on('seeked', this.onSeekedTrack.bind(this))
    soundCloudAudio.on('pause', this.onAudioPaused.bind(this))
    soundCloudAudio.on('ended', this.onAudioEnded.bind(this))
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

  onSeekingTrack() {
    const { setSeeking } = this.props
    setSeeking(true)
  }

  onSeekedTrack() {
    const { setSeeking } = this.props
    setSeeking(false)
  }

  onAudioStarted() {
    const { soundCloudAudio, setPlaying } = this.props

    setPlaying(true)
    stopAllOther(soundCloudAudio.playing)
    addToPlayedStore(soundCloudAudio)
  }

  onAudioPaused() {
    const { setPlaying } = this.props
    setPlaying(false)
  }

  onAudioEnded() {
    const { setPlaying } = this.props
    setPlaying(false)
  }

  getCurrentTime() {
    const { soundCloudAudio, setTime } = this.props
    setTime(soundCloudAudio.audio.currentTime)
  }

  getDuration() {
    const { soundCloudAudio, setDuration } = this.props
    setDuration(soundCloudAudio.audio.duration)
  }

  wrapChild(child) {
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
  children: PropTypes.node,
  clientId: PropTypes.string,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
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
  soundCloudAudio: state.listen.soundCloudAudio,
  clientId: state.listen.clientId,
  resolveUrl: state.listen.resolveUrl,
  duration: state.listen.duration,
  currentTime: state.listen.currentTime,
  seeking: state.listen.seeking,
  playing: state.listen.playing,
  playlist: state.listen.playlist,
}), listenActions)(SoundPlayerContainer)
