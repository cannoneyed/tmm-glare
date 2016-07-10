import P from 'bluebird'

import {
  removeGeoquery,
  connectCancelled,
} from '../index'

export default function cancelConnecting() {
  return (dispatch, getState) => {
    dispatch(connectCancelled())

    const { firebase, auth, connection } = getState()

    // If a firebase geoquery exists, cancel it
    if (connection.geoquery) {
      connection.geoquery.cancel()
      dispatch(removeGeoquery())
    }


    // Set up a transaction function to ensure that the beacon is erased when connecting is
    // cancelled
    return P.props({
      removeBeacon: firebase.database().ref().child(`beacons/${auth.id}`).transaction(() => null),
      removeBeaconLocation: firebase.database().ref().child(`beaconLocations/${auth.id}`).transaction(() => null)
    })
  }
}
