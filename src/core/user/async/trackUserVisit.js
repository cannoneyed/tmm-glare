export default function trackUserVisitAsync(user) {
  return (dispatch, getState) => {

    console.log('🍕')

    const { firebase } = getState()
    const { visits = 0 } = user

    return firebase.database().ref().child(`users/${user.key}/visits`).set(visits)
  }
}