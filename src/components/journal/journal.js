import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Entry from './entry'

const Journal = (props) => {
  const { entries } = props
  entries.reverse()

  for (let i = 0; i < 5; i++) {
    entries.push(entries[0])
  }

  return (
    <div className="journal-container">
      {entries.map((entry, index) => {
        const showBorder = index !== entries.length - 1
        return <Entry key={index} entry={entry} showBorder={showBorder} />
      })}
    </div>
  )
}

Journal.propTypes = {
  entries: PropTypes.array.isRequired,
}

export default connect(state => ({
  entries: state.journal.entries,
}), null)(Journal)
