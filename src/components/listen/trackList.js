/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import {
  Timer,
} from './components'
import { Icon, RippleButton } from '../shared'
import TrackInfo from './trackInfo'

import * as listenActions from 'src/core/listen'
import { isTrackUnlocked } from 'src/core/listen/selectors'

function TrackList(props) {
  let {
    activeIndex,
    isTrackUnlocked,
    playlist,
    selectedIndex,
    setSelectedIndex,
  } = props

  let tracks = playlist.tracks.map((track, index) => {
    const isSelected = selectedIndex === index
    const isActive = activeIndex === index
    let names = classnames('playlist-row', {
      'is-selected': isSelected,
      'is-active': isActive,
    })

    const string = track.title.replace('The M Machine - ', '')
    const pieces = string.split('Ft. ')
    const title = pieces[0]
    const featuring = pieces[1]

    const time = Timer.prettyTime(track.duration / 1000)

    const unlocked = isTrackUnlocked(index)

    const titleDisplay = () => (
      <span className="title">
        { title }
        { featuring ?
          <span className="featuring">{`ft. ${featuring}`}</span> :
          null
        }
      </span>
    )
    const locked = () => (
      <span className="title locked">
        <Icon type="lock" size={20} />
      </span>
    )
    const trackInfo = () => <TrackInfo index={index} time={time} />

    return (
      <RippleButton
        key={track.id}
        className={names}
        onClick={() => setSelectedIndex(index)}>
        { unlocked ? titleDisplay() : locked() }
        { unlocked ? trackInfo() : <span /> }
      </RippleButton>
    )
  })

  return (
    <div>{tracks}</div>
  )
}

TrackList.propTypes = {
  activeIndex: PropTypes.number,
  isTrackUnlocked: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  selectedIndex: PropTypes.number,
  setSelectedIndex: PropTypes.func,
}

export default connect(state => ({
  activeIndex: state.listen.activeIndex,
  isTrackUnlocked: isTrackUnlocked(state),
  playlist: state.listen.playlist,
  selectedIndex: state.listen.selectedIndex,
}), {
  setSelectedIndex: listenActions.setSelectedIndex,
})(TrackList)
