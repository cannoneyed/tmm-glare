import {
  connectPending,
} from '../index'

export default function connectWithUserAsync(other) {
  return (dispatch, getState) => {
    const {
      auth,
      firebase,
      location,
    } = getState()

    // Using the web JavaScript client
    var tasksRef = firebase.database().ref('queue/tasks')
    tasksRef.push({
      type: 'SET_CONNECTION',
      to: other.key,
      from: auth.id,
      timestamp: Date.now(),
      latitude: location.latitude,
      longitude: location.longitude,
    })

    dispatch(connectPending(other.key))
  }
}
