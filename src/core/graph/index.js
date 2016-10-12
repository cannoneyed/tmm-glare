export const SET_IS_GRAPH_LOADING = 'graph/SET_IS_GRAPH_LOADING'
export const SET_GRAPH_DATA = 'graph/SET_GRAPH_DATA'
export const SET_USER = 'graph/SET_USER'
export const SET_SELECTED_USER_ID = 'graph/SET_SELECTED_USER_ID'

export const initialState = {
  data: {},
  isGraphLoaded: false,
  isGraphLoading: false,
  stats: {},
  selectedUserId: null,
  users: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_IS_GRAPH_LOADING:
      return { ...state, isGraphLoading: action.payload }
    case SET_GRAPH_DATA: {
      const payload = action.payload
      return {
        ...state,
        stats: payload.stats,
        nodes: payload.nodes,
        isGraphLoaded: true,
        isGraphLoading: false,
      }
    }
    case SET_SELECTED_USER_ID:
      return {
        ...state,
        selectedUserId: action.payload,
      }
    case SET_USER: {
      const user = action.payload
      return {
        ...state,
        users: {
          ...state.users,
          [user.key]: user,
        }
      }
    }
    default:
      return state
  }
}

// Action creators
export function setIsGraphLoading(isLoading) {
  return { type: SET_IS_GRAPH_LOADING, payload: isLoading }
}

export function setGraphData({ nodes, stats }) {
  return { type: SET_GRAPH_DATA, payload: { nodes, stats } }
}

export function setUser(user) {
  return { type: SET_USER, payload: user }
}

export function setSelectedUserId(userId) {
  return { type: SET_SELECTED_USER_ID, payload: userId }
}

export function unselectUser() {
  return { type: SET_SELECTED_USER_ID, payload: null }
}

// Async Actions
export * from './async'
