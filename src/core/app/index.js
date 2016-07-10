// Actions
const TOGGLE_SIDEBAR = 'app/TOGGLE_SIDEBAR'

// Reducer
const initialState = {
  isSidebarOpen: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      const isSidebarOpen = action.payload === undefined ? !state.isSidebarOpen : !!action.payload
      return { ...state, isSidebarOpen }
    }
    default:
      return state
  }
}

// Action Creators
export function toggleSidebar(isOpen) {
  return { type: TOGGLE_SIDEBAR, payload: isOpen }
}
