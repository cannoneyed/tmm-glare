export const SET_CONNECTION_GRAPH = 'connections/SET_CONNECTION_GRAPH'
export const SET_IS_PROCESSING_GRAPH = 'connections/SET_IS_PROCESSING_GRAPH'

export const initialState = {
  isGraphProcessing: false,
  isGraphLoaded: false,
  graph: {
    links: [],
    nodes: [],
  },
  stats: {},
  from: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_IS_PROCESSING_GRAPH:
      return { ...state, isGraphProcessing: action.payload }
    case SET_CONNECTION_GRAPH:
      return {
        ...state,
        ...action.payload,
        isGraphLoaded: true,
        isGraphProcessing: false,
      }
    default:
      return state
  }
}

// Action creators
export function setConnectionGraph(data) {
  return { type: SET_CONNECTION_GRAPH, payload: data }
}

export function setIsProcessingGraph(isProcessing) {
  return { type: SET_IS_PROCESSING_GRAPH, payload: isProcessing }
}

// Async Actions
export * from './async'
