import _ from 'lodash'

export function getUnreadJournalCount(state) {
  const { journal, user } = state

  if (journal.hasReadJournal || !user) {
    return 0
  }

  const unreadJournalCount = _.map(journal.entries, entry => entry)
    // .filter(entry => getTime(entry.dateCreated) > getTime(user.dateLastVisited))
    .filter(() => true)
    .length

  return unreadJournalCount
}

// function getTime(date) {
//   return new Date(date).getTime()
// }
