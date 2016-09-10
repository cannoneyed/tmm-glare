// Actions
export const SHOW_MODAL = 'modals/SHOW_MODAL'
export const CLOSE_MODAL = 'modals/CLOSE_MODAL'

// Modal Types
export const DID_GIVE = 'modalTypes/DID_GIVE'
export const DID_RECEIVE = 'modalTypes/DID_RECEIVE'

// Reducer
export const initialState = {
  isShowing: false,
  type: null,
  data: null,
}

export default function reducer(state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case SHOW_MODAL:
      return {
        isShowing: true,
        ...payload,
      }
    case CLOSE_MODAL:
      return initialState
    default:
      return state
  }
}

// Action Creators
export function showModal({ kind, data }) {
  return { type: SHOW_MODAL, payload: { kind, data } }
}

export function closeModal() {
  return { type: CLOSE_MODAL }
}
