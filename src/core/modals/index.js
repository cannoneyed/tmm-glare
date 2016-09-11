// Actions
export const OPEN_MODAL = 'modals/OPEN_MODAL'
export const CLOSE_MODAL = 'modals/CLOSE_MODAL'

// Modal Types
export const DID_GIVE = 'modalTypes/DID_GIVE'
export const DID_RECEIVE = 'modalTypes/DID_RECEIVE'

// Reducer
export const initialState = {
  isOpen: false,
  type: null,
  data: null,
}

export default function reducer(state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case OPEN_MODAL:
      return {
        isOpen: true,
        ...payload,
      }
    case CLOSE_MODAL:
      return initialState
    default:
      return state
  }
}

// Action Creators
export function openModal({ kind, data }) {
  return { type: OPEN_MODAL, payload: { kind, data } }
}

export function closeModal() {
  return { type: CLOSE_MODAL }
}
