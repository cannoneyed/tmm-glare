import React, { PropTypes } from 'react'

export default function Tracks(props) {
  const { params: { trackId } } = props

  return (
    <div className="track-container">
      <h1>{`FUCK YOU! ${trackId}`}</h1>
    </div>
  )
}

Tracks.propTypes = {
  params: PropTypes.object,
}
