import P from 'bluebird'

import {
  CONNECT_SUCCESS,
} from '../action-types'

export default function connectWithUser(otherId) {
  return (dispatch, getState) => {
    const { auth, firebase, location } = getState()

    const connectionKey = [auth.id, otherId].join('::::')

    // Create the connection object
    return firebase.database().ref().child(`connections/${connectionKey}`)
      .set({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
        shared: auth.id,
        received: otherId,
      })
      .then(() => {
        // Set the connection and set hasAccess true on both user objects
        const selfToUpdate = {
          [`connections/${otherId}`]: otherId,
          hasAccess: true,
        }

        const otherToUpdate = {
          [`connections/${auth.id}`]: auth.id,
          hasAccess: true,
        }

        return P.props({
          setConnectionSelf: firebase.database().ref().child(`users/${auth.id}`).update(selfToUpdate),
          setConnectionOther: firebase.database().ref().child(`users/${otherId}`).update(otherToUpdate),
        })
      })
      .then(() => {
        // Remove the beacon and beaconLocation for both users
        return P.props({
          removeBeaconSelf: firebase.database().ref().child(`beacons/${auth.id}`).set(null),
          removeBeaconLocationSelf: firebase.database().ref().child(`beaconLocations/${auth.id}`).set(null),
          removeBeaconOther: firebase.database().ref().child(`beacons/${otherId}`).set(null),
          removeBeaconLocationOther: firebase.database().ref().child(`beaconLocations/${otherId}`).set(null),
        })
      })
      .then(() => {
        dispatch({ type: CONNECT_SUCCESS, payload: otherId })
      })
  }
}
