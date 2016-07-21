import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import {
  Timer,
} from './components'
import { RippleButton } from '../shared'
import TrackButtons from './trackButtons'

import * as listenActions from 'src/core/listen'

function TrackList(props) {
  let {
    activeIndex,
    playlist,
    selectedIndex,
    setSelectedIndex,
  } = props

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
        onClick={() => setSelectedIndex(i)}>
        <span className="title">
          { title }
          { featuring ?
            <span className="featuring">{`ft. ${featuring}`}</span> :
            null
          }
        </span>
        { isSelected ?
          <TrackButtons index={i} /> :
          <span className="time">{time}</span>
        }
      </RippleButton>
    )
  })

  return (
    <div>{tracks}</div>
  )
}

TrackList.propTypes = {
  activeIndex: PropTypes.number,
  playlist: PropTypes.object,
  selectedIndex: PropTypes.number,
  setSelectedIndex: PropTypes.func,
}

export default connect(state => ({
  activeIndex: state.listen.activeIndex,
  playlist: state.listen.playlist,
  selectedIndex: state.listen.selectedIndex,
}), {
  setSelectedIndex: listenActions.setSelectedIndex,
})(TrackList)
