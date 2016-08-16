export const SET_CONNECTION_STATS = 'connections/SET_CONNECTION_STATS'
export const SET_IS_PROCESSING_STATS = 'connections/SET_IS_PROCESSING_STATS'

export const initialState = {
  isStatsLoaded: false,
  isStatsProcessing: false,
  isGraphLoaded: false,
  stats: {},
  graph: {},
  users: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_IS_PROCESSING_STATS:
      return { ...state, isProcessing: action.payload }
    case SET_CONNECTION_STATS:
      return {
        ...state,
        stats: action.payload,
        isStatsLoaded: true,
        isStatsProcessing: false,
      }
    default:
      return state
  }
}

// Action creators
export function setConnectionStats(stats) {
  return { type: SET_CONNECTION_STATS, payload: stats }
}

export function setIsProcessingStats(isProcessing) {
  return { type: SET_IS_PROCESSING_STATS, payload: isProcessing }
}

// Async Actions
export * from './async'
