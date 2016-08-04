import _ from 'lodash'

// Action types
export const SET_JOURNAL = 'journal/SET_JOURNAL'
export const READ_JOURNAL = 'journal/READ_JOURNAL'

// Reducer
export const initialState = {
  entries: [],
  latestJournalEntry: null,
  hasReadJournal: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_JOURNAL:
      return {
        ...state,
        entries: action.payload.slice(),
        latestJournalEntry: _.last(action.payload).dateCreated,
      }
    case READ_JOURNAL:
      return { ...state, hasReadJournal: true }
    default:
      return state
  }
}

export function setJournal(entries) {
  return { type: SET_JOURNAL, payload: entries }
}

export function readJournal() {
  return { type: READ_JOURNAL }
}

export * from './async'
