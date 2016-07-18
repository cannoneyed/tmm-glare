// Manage the sign up with email flow (create a new account)
export default function signUpWithEmailAsync(email, password) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        // Handle Errors here.
        // const errorCode = error.code
        // const errorMessage = error.message

        console.log('❗', error)
        // ...
      })
  }
}
