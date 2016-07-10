import _ from 'lodash'

export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export const initialState = []
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const pathname = action.payload.pathname
      if (action.payload.action === 'POP') {
        return state.slice(0, state.length - 1)
      }
      if (action.payload.action === 'PUSH') {
        return state.concat('pathname')
      }
      if (action.payload.action === 'REPLACE' && pathname !== _.last(state)) {
        return state.concat(pathname)
      }
      return state
    }
    default:
      return state
  }
}
