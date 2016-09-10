import { firebase } from 'src/firebase'

export default function trackUserVisitAsync(user) {
  return () => {
    const { visits = 0 } = user

    return firebase.database().ref().child(`users/${user.key}`).update({
      visits: visits + 1,
      dateLastVisited: new Date(),
    })
  }
}
