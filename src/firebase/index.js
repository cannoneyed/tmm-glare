import Firebase from 'firebase'
import GeoFire from 'geofire'
import { firebaseConfig } from '../config'

// Initialize firebase and geofire
export const firebase = Firebase.initializeApp(firebaseConfig)

export const geofire = {
  beaconLocations: new GeoFire(firebase.database().ref().child('beaconLocations')),
}
