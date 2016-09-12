export const SET_CONNECTION_STATS = 'connections/SET_CONNECTION_STATS'
export const SET_IS_PROCESSING_STATS = 'connections/SET_IS_PROCESSING_STATS'
export const SET_IS_GRAPH_LOADING = 'connections/SET_IS_GRAPH_LOADING'
export const SET_INITIAL_GRAPH = 'connections/SET_INITIAL_GRAPH'
export const ADD_CONNECTION = 'connections/ADD_CONNECTION'
export const ADD_USER = 'connections/ADD_USER'
export const CLEAR_QUEUE = 'connections/CLEAR_QUEUE'
export const SET_USER_EXPANDED = 'connections/SET_USER_EXPANDED'

export const initialState = {
  isGraphLoaded: false,
  isGraphLoading: false,
  isStatsProcessing: false,
  isStatsLoaded: false,
  stats: {},
  graph: {
    users: {},
    connections: {},
  },
  queue: {
    users: {},
    connections: {},
  },
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_IS_GRAPH_LOADING:
      return { ...state, isGraphLoading: action.payload }
    case SET_IS_PROCESSING_STATS:
      return { ...state, isGraphProcessing: action.payload }
    case SET_CONNECTION_STATS:
      return {
        ...state,
        stats: action.payload,
        isStatsLoaded: true,
        isStatsProcessing: false,
      }
    case SET_INITIAL_GRAPH:
      return {
        ...state,
        graph: action.payload,
        isGraphLoaded: true,
        isGraphLoading: false,
      }
    case ADD_USER:
      return {
        ...state,
        graph: {
          ...state.graph,
          users: {
            ...state.graph.users,
            [action.payload.key]: action.payload,
          }
        },
        queue: {
          ...state.queue,
          users: {
            ...state.queue.users,
            [action.payload.key]: action.payload,
          }
        },
      }
    case ADD_CONNECTION:
      return {
        ...state,
        graph: {
          ...state.graph,
          connections: {
            ...state.graph.connections,
            [action.payload.to]: action.payload,
          }
        },
        queue: {
          ...state.queue,
          connections: {
            ...state.queue.connections,
            [action.payload.to]: action.payload,
          }
        }
      }
    case CLEAR_QUEUE:
      return {
        ...state,
        queue: {
          users: {},
          connections: {},
        }
      }
    case SET_USER_EXPANDED:
      return {
        ...state,
        graph: {
          ...state.graph,
          users: {
            ...state.graph.users,
            [action.payload]: {
              ...state.graph.users[action.payload],
              isExpanded: true,
            }
          }
        }
      }
    default:
      return state
  }
}

// Action creators
export function setConnectionStats(data) {
  return { type: SET_CONNECTION_STATS, payload: data }
}

export function setIsProcessingStats(isProcessing) {
  return { type: SET_IS_PROCESSING_STATS, payload: isProcessing }
}

export function setIsGraphLoading(isLoading) {
  return { type: SET_IS_GRAPH_LOADING, payload: isLoading }
}

export function setInitialGraph(graph) {
  return { type: SET_INITIAL_GRAPH, payload: graph }
}

export function addConnection(connection) {
  return { type: ADD_CONNECTION, payload: connection }
}

export function addUser(user) {
  return { type: ADD_USER, payload: user }
}

export function clearQueue() {
  return { type: CLEAR_QUEUE }
}

export function setUserExpanded(userId) {
  return { type: SET_USER_EXPANDED, payload: userId }
}

// Async Actions
export * from './async'
