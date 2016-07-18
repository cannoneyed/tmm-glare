export const SET_RAW_DATA = 'connections/SET_RAW_DATA'

export const initialState = {
  rawData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_RAW_DATA:
      return { ...state, rawData: action.payload}
    default:
      return state
  }
}

// Action creators
export function setRawData(data) {
  return { type: SET_RAW_DATA, payload: data }
}
