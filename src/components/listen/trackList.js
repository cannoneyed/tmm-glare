/* eslint-disable react/no-multi-comp */
import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import {
  Timer,
} from './components'
import { Icon, RippleButton } from '../shared'
import TrackInfo from './trackInfo'

import * as listenActions from 'src/core/listen'
import { isTrackUnlocked } from 'src/core/listen/selectors'

class TrackList extends Component {
  static propTypes = {
    activeIndex: PropTypes.number,
    isTrackUnlocked: PropTypes.func.isRequired,
    playTrackAtIndex: PropTypes.func.isRequired,
    playlist: PropTypes.object,
    selectedIndex: PropTypes.number,
    setSelectedIndex: PropTypes.func,
  }

  createClickHandler = (index) => {
    const {
      playTrackAtIndex,
      setSelectedIndex
    } = this.props
    const unlocked = this.isTrackUnlocked(index)
    return () => {
      if (unlocked) {
        playTrackAtIndex(index)
      } else {
        setSelectedIndex(index)
      }
    }
  }

  renderTitle = (trackTitle, index) => {
    const string = trackTitle.replace('The M Machine - ', '')
    const pieces = string.split('Ft. ')
    const title = pieces[0]
    const featuring = pieces[1]

    return (
      <span
        className="title"
        onClick={this.createClickHandler(index)}>
        { title }
        { featuring ?
          <span className="featuring">{`ft. ${featuring}`}</span> :
          null
        }
      </span>
    )
  }

  renderLocked = () => {
    return (
      <span className="title locked">
        <Icon type="lock" size={20} />
      </span>
    )
  }

  isTrackUnlocked = (index) => {
    const { isTrackUnlocked } = this.props
    return isTrackUnlocked(index)
  }

  render() {
    const {
      activeIndex,
      playlist,
      selectedIndex,
    } = this.props

    const tracks = playlist.tracks.map((track, index) => {
      const isSelected = selectedIndex === index
      const isActive = activeIndex === index
      let names = classnames('playlist-row', {
        'is-selected': isSelected,
        'is-active': isActive,
      })

      const time = Timer.prettyTime(track.duration / 1000)
      const unlocked = this.isTrackUnlocked(index)

      return (
        <RippleButton
          key={track.id}
          className={names}>
          { unlocked ? this.renderTitle(track.title, index) : this.renderLocked() }
          { unlocked ? <TrackInfo index={index} time={time} /> : <span /> }
        </RippleButton>
      )
    })

    return (
      <div className="tracks-list scrollable">
        {tracks}
        <div className="tracks-list-spacer" />
      </div>
    )
  }
}

export default connect(state => ({
  activeIndex: state.listen.activeIndex,
  isTrackUnlocked: isTrackUnlocked(state),
  playlist: state.listen.playlist,
  selectedIndex: state.listen.selectedIndex,
}), {
  playTrackAtIndex: listenActions.playTrackAtIndex,
  setSelectedIndex: listenActions.setSelectedIndex,
})(TrackList)
