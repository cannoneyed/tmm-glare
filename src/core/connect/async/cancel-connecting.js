import P from 'bluebird'
import { firebase } from 'src/firebase'

import {
  removeGeoquery,
  connectCancelled,
} from '../index'

export default function cancelConnectingAsync() {
  return (dispatch, getState) => {
    dispatch(connectCancelled())

    const { auth, connect } = getState()

    // If a firebase geoquery exists, cancel it
    if (connect.geoquery) {
      connect.geoquery.cancel()
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
