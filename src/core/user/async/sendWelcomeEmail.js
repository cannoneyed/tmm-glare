import { firebase } from 'src/firebase'

export default function sendWelcomeEmailAsync() {
  return (dispatch, getState) => {
    const { user } = getState()

    const { email } = user

    // Add the SEND_WELCOME_EMAIL job to the queue
    const tasksRef = firebase.database().ref('queue/tasks')
    tasksRef.push({
      type: 'SEND_WELCOME_EMAIL',
      email,
    })
  }
}
