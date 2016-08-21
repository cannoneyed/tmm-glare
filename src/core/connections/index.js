export const SET_CONNECTION_STATS = 'connections/SET_CONNECTION_STATS'
export const SET_IS_PROCESSING_STATS = 'connections/SET_IS_PROCESSING_STATS'
export const SET_IS_GRAPH_LOADING = 'connections/SET_IS_GRAPH_LOADING'
export const SET_GRAPH = 'SET_GRAPH'

export const initialState = {
  isGraphLoaded: false,
  isGraphLoading: false,
  isStatsProcessing: false,
  isStatsLoaded: false,
  stats: {},
  graph: null,
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
    case SET_GRAPH:
      return {
        ...state,
        graph: action.payload,
        isGraphLoaded: true,
        isGraphLoading: false,
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

export function setGraph(graph) {
  return { type: SET_GRAPH, payload: graph }
}

// Async Actions
export * from './async'
