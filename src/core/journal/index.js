import _ from 'lodash'

// Action types
export const SET_JOURNAL = 'journal/SET_JOURNAL'

// Reducer
export const initialState = {
  entries: [],
  latestJournalEntry: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_JOURNAL:
      return {
        entries: action.payload.slice(),
        latestJournalEntry: _.last(action.payload).dateCreated,
      }
    default:
      return state
  }
}

export function setJournal(entries) {
  return { type: SET_JOURNAL, payload: entries }
}

export * from './async'
