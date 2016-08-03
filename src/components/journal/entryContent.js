/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import dateFormat from 'dateformat'

import { TRACK_UNLOCKED } from 'src/core/journal/types'

import { trackTitles } from 'src/core/constants'


const EntryContent = (props) => {
  const { entry } = props
  const { milestone, type, dateCreated } = entry
  const entryDate = formatDate(dateCreated)

  let header
  if (type === TRACK_UNLOCKED) {
    const { index } = entry
    header = (
      <div className="entry-content-header">
        {`Unlocked track ${index + 1}`}
        <span className="trackTitle">{getTrackTitle(index)}</span>
      </div>
    )
  }

  return (
    <div className="entry-content">
      { header }
      <div className="entry-content-milestone">
        { milestone }
      </div>
      <div className="entry-content-date">
        { entryDate }
      </div>
    </div>
  )
}

function getTrackTitle(index) {
  return trackTitles[index]
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return dateFormat(date, 'mmm dS, yyyy h:MM TT')
}

EntryContent.propTypes = {
  entry: PropTypes.object.isRequired,
}

export default EntryContent
