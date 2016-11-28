import Firebase from 'firebase'
import GeoFire from 'geofire'
import config from '../config'

// Initialize firebase and geofire
export const firebase = Firebase.initializeApp(config.firebaseConfig)

export const geofire = {
  beaconLocations: new GeoFire(firebase.database().ref().child('beaconLocations')),
}
