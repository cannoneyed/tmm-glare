import { firebase } from 'src/firebase'

export default function countPlay() {
  return (dispatch, getState) => {

    const { user } = getState()
    const { plays = 0 } = user

    const db = firebase.database().ref()

    return db.child(`users/${user.key}`).update({
      plays: plays + 1,
    })
  }
}
