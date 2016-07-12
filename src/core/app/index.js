// Actions
const TOGGLE_SIDEBAR = 'app/TOGGLE_SIDEBAR'
const FINISH_INTRO = 'app/FINISH_INTRO'

// Reducer
const initialState = {
  isSidebarOpen: false,
  hasViewedIntro: false,
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
