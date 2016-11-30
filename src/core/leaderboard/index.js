// Action types
export const SET_LEADERBOARD = 'leaderboard/SET_LEADERBOARD'

// Reducer
export const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LEADERBOARD:
      return action.payload
    default:
      return state
  }
}

export function setLeaderboard(entries) {
  return { type: SET_LEADERBOARD, payload: entries }
}

export * from './async'
