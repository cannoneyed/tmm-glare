import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Entry from './entry'

const Journal = (props) => {
  const { entries } = props
  entries.reverse()

  return (
    <div className="journal-container">
      {entries.map((entry, index) => {
        return <Entry key={index} entry={entry} />
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
