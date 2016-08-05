// Actions
const TOGGLE_SIDEBAR = 'app/TOGGLE_SIDEBAR'
const FINISH_INTRO = 'app/FINISH_INTRO'
const CLOSE_MODAL = 'app/CLOSE_MODAL'
const OPEN_MODAL = 'app/OPEN_MODAL'


import {
  LOAD_USER,
} from '../user'

// Reducer
const initialState = {
  isSidebarOpen: false,
  hasViewedIntro: false,
  showModal: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      const isSidebarOpen = action.payload === undefined ? !state.isSidebarOpen : !!action.payload
      return { ...state, isSidebarOpen }
    }
    case FINISH_INTRO: {
      return { ...state, hasViewedIntro: true }
    }
    case LOAD_USER: {
      const user = action.payload
      const hasViewedIntro = user.visits > 0
      return { ...state, hasViewedIntro }
    }
    case CLOSE_MODAL:
      return { ...state, showModal: false }
    case OPEN_MODAL:
      return { ...state, showModal: true }
    default:
      return state
  }
}

// Action Creators
export function toggleSidebar(isOpen) {
  return { type: TOGGLE_SIDEBAR, payload: isOpen }
}

export function finishIntro() {
  return { type: FINISH_INTRO }
}

export function closeModal() {
  return { type: CLOSE_MODAL }
}

export function openModal() {
  return { type: OPEN_MODAL }
}

// Async Actions
export * from './async'
