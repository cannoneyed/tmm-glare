import React, { PropTypes } from 'react'

import getIndividualTrack from './individual'

export default function Tracks(props) {
  const { params: { trackId } } = props

  return (
    <div className="track-info-container">
      {getIndividualTrack(trackId)}
    </div>
  )
}

Tracks.propTypes = {
  params: PropTypes.object,
}
