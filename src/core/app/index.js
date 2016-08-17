// Actions
const TOGGLE_SIDEBAR = 'app/TOGGLE_SIDEBAR'
const FINISH_INTRO = 'app/FINISH_INTRO'
const CLOSE_MODAL = 'app/CLOSE_MODAL'
const OPEN_MODAL = 'app/OPEN_MODAL'
const SET_BACKGROUND = 'app/SET_BACKGROUND'
const SET_TOUCH_FIXED = 'app/SET_TOUCH_FIXED'

import {
  LOAD_USER,
} from '../user'

// Reducer
const initialState = {
  isSidebarOpen: false,
  hasViewedIntro: false,
  isTouchFixed: false,
  showModal: false,
  background: 0,
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
    case SET_BACKGROUND:
      return { ...state, background: action.payload }
    case SET_TOUCH_FIXED:
      return { ...state, isTouchFixed: action.payload }
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

export function setEmptyBackground() {
  return { type: SET_BACKGROUND, payload: 0 }
}

export function setRandomBackground() {
  const n = Math.floor(Math.random() * 6) + 1
  return { type: SET_BACKGROUND, payload: n }
}

export function setTouchFixed(isFixed) {
  return { type: SET_TOUCH_FIXED, payload: isFixed }
}

// Async Actions
export * from './async'
