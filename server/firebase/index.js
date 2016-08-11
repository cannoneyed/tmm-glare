const Firebase = require('firebase')
const GeoFire = require('geofire')

const { firebaseConfig } = require('config')

const firebase = Firebase.initializeApp(firebaseConfig)
const geofire = {
  beaconLocations: new GeoFire(firebase.database().ref().child('beaconLocations')),
}

module.exports = {
  firebase,
  geofire,
}
