import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Entry from './entry'

import * as journalActions from 'src/core/journal'

class Journal extends Component {

  static propTypes = {
    dateLastVisited: PropTypes.string,
    entries: PropTypes.array.isRequired,
    hasReadJournal: PropTypes.bool.isRequired,
    readJournal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { readJournal } = this.props
    readJournal()
  }

  render() {
    const { entries, dateLastVisited, hasReadJournal } = this.props
    entries.reverse()

    const dateIsLater = (date) => {
      return new Date(date).getTime() > new Date(dateLastVisited).getTime()
    }

    return (
      <div className="journal-container">
        <div className="journal-list scrollable">
          {entries.map((entry, index) => {
            const showBorder = index !== entries.length - 1
            const isUnread = !hasReadJournal && dateIsLater(entry.dateCreated)

            return (
              <Entry
                key={index}
                entry={entry}
                showBorder={showBorder}
                isUnread={isUnread}
              />
            )
          })}
          <div className="journal-list-spacer" />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  entries: state.journal.entries,
  dateLastVisited: state.user.dateLastVisited,
  hasReadJournal: state.journal.hasReadJournal,
}), {
  readJournal: journalActions.readJournal,
})(Journal)
