import { firebase } from 'src/firebase'

export default function sendWelcomeEmailAsync(email) {
  return (dispatch) => {

    dispatch({
      type: 'SEND_WELCOME_EMAIL',
      payload: email,
    })

    // Add the SEND_WELCOME_EMAIL job to the queue
    const tasksRef = firebase.database().ref('queue/tasks')
    tasksRef.push({
      type: 'SEND_WELCOME_EMAIL',
      email,
    })
  }
}
