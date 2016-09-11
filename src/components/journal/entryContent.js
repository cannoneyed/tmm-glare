/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import dateFormat from 'dateformat'

import { TRACK_UNLOCKED } from 'src/core/journal/types'

import { trackTitles } from 'src/constants'


const EntryContent = (props) => {
  const { entry } = props
  const { milestone, type, dateCreated } = entry
  const entryDate = formatDate(dateCreated)

  let header
  if (type === TRACK_UNLOCKED) {
    const { index } = entry
    header = (
      <div className="entry-content-header">
        <div className="entry-content-header-action">
          {`Track ${index + 1} unlocked!`}
        </div>
        <div className="entry-content-header-title">
          {getTrackTitle(index)}
        </div>
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
