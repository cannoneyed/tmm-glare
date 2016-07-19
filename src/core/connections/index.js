export const SET_RAW_DATA = 'connections/SET_RAW_DATA'
export const SET_GRAPH = 'connections/SET_GRAPH'

export const initialState = {
  isGraphProcessed: false,
  rawData: {},
  graph: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_RAW_DATA:
      return { ...state, rawData: action.payload}
    case SET_GRAPH:
      return { ...state, graph: action.payload, isGraphProcessed: true }
    default:
      return state
  }
}

// Action creators
export function setRawData(data) {
  return { type: SET_RAW_DATA, payload: data }
}

export function setProcessedGraph(graph) {
  return { type: SET_GRAPH, payload: graph }
}

// Async Actions
export * from './async'
