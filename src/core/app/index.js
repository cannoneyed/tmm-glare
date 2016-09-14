// Actions
const TOGGLE_SIDEBAR = 'app/TOGGLE_SIDEBAR'
const FINISH_INTRO = 'app/FINISH_INTRO'
const SET_BACKGROUND = 'app/SET_BACKGROUND'
const SET_TOUCH_FIXED = 'app/SET_TOUCH_FIXED'
const IS_INCOGNITO = 'app/IS_INCOGNITO'

import {
  LOAD_USER,
} from '../user'

// Reducer
const initialState = {
  hasViewedIntro: false,
  isIncognito: false,
  isSidebarOpen: false,
  isTouchFixed: false,
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
      const hasViewedIntro = user && user.visits > 0
      return { ...state, hasViewedIntro }
    }
    case SET_BACKGROUND:
      return { ...state, background: action.payload }
    case SET_TOUCH_FIXED:
      return { ...state, isTouchFixed: action.payload }
    case IS_INCOGNITO:
      return { ...state, isIncognito: true }
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

export function isIncognito() {
  return { type: IS_INCOGNITO }
}

// Async Actions
export * from './async'
