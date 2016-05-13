import P from 'bluebird'
import _ from 'lodash'
import * as util from 'src/util'

import {
  CREATE_BEACON,
  REMOVE_BEACON,
  FOUND_BEACON,
  CONNECT_SUCCESS,
  CONNECT_CANCELED,
  // CONNECT_ERROR,
  BEGIN_CONNECTING,
} from './action-types'

import {
  GEOLOCATION_SUCCESS,
  GEOLOCATION_ERROR,
  GEOLOCATION_DENIED,
} from '../location/action-types'

function getGeolocation() {
  if (navigator && navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  } else {
    return Promise.reject()
  }
}

function handleGeolocationError(err) {
  return (dispatch) => {
    if (err.code === 1 || err.message === 'User denied Geolocation') {
      dispatch({ type: GEOLOCATION_DENIED })
    } else {
      dispatch({ type: GEOLOCATION_ERROR, err })
    }
  }
}

function findBeacons({ coords }) {
  const { latitude, longitude } = coords
  return (dispatch, getState) => {
    const { geofire } = getState()

    const geoQuery = geofire.beaconLocations.query({
      center: [latitude, longitude],
      radius: 100,
    })

    return dispatch(registerListeners({ geoQuery }))
  }
}

function registerListeners({ geoQuery }) {
  return (dispatch, getState) => {
    const { auth, firebase, user } = getState()

    // Register event listener for finding a beacon by the geoquery
    geoQuery.on('key_entered', (key) => {
      const isConnected = _.get(user, ['connections', key])

      // Ignore the user's beacon and any beacons of users the user is already
      // connected to
      if (key === auth.id || isConnected) {
        return
      }

      // Get the user record corresponding to the geokey
      firebase.child(`users/${key}`).once('value', snapshot => {
        const otherUser = util.recordFromSnapshot(snapshot)

        // If the current user has access, add this beacon to the list of available
        // users to connect with
        if (user.hasAccess) {
          return dispatch({ type: FOUND_BEACON, payload: otherUser})
        }

        // Otherwise, only add the beacon to the list if the other user has access
        if (otherUser && otherUser.hasAccess) {
          return dispatch({ type: FOUND_BEACON, payload: otherUser })
        }
      })
    })

    // Register event listeners for the beacon being removed
    geoQuery.on('key_exited', (key) => {
      // Ignore the removed beacon if it's the users (this is handled in app)
      if (key === auth.id) {
        return
      }

      // Otherwise, get the user record corresponding to the removed beacon to remove
      // from the beacons list
      firebase.child(`users/${key}`).once('value', snapshot => {
        const user = util.recordFromSnapshot(snapshot)
        dispatch({ type: REMOVE_BEACON, payload: user.id })
      })
    })
  }
}

function createBeacon({ coords, timestamp }) {
  const { latitude, longitude } = coords
  return (dispatch, getState) => {
    const { auth, firebase, geofire } = getState()

    return P.props({
      // Set the beacon location and the corresponding listener for removing on disconnect
      beaconlocation: geofire.beaconLocations.set(auth.id, [latitude, longitude])
        .then(() => firebase.child(`beaconLocations/${auth.id}`).onDisconnect().remove()),

      // Set the beacon data and the corresponding listener for removing on disconnect
      beacon: firebase.child(`beacons/${auth.id}`)
        .set({ latitude, longitude, timestamp })
        .then(() => firebase.child(`beacons/${auth.id}`).onDisconnect().remove())
    })
    .then(() => {
      dispatch({ type: CREATE_BEACON })
    })
  }
}

export function beginConnecting() {
  return (dispatch) => {
    dispatch({ type: BEGIN_CONNECTING })

    return getGeolocation()
      .catch(err => dispatch(handleGeolocationError(err)))
      .then(location => {
        const { coords } = location

        dispatch({
          type: GEOLOCATION_SUCCESS,
          payload: coords,
        })

        return P.props({
          createBeacon: dispatch(createBeacon(location)),
          findBeacons: dispatch(findBeacons(location)),
        })
      })
      .then(() => {
        // return dispatch(removeBeacon())
      })
      .then(() => {
        // console.log('Beacon was removed!')
      })
  }
}

export function connectWithUser(otherId) {
  return (dispatch, getState) => {
    const { auth, firebase, location } = getState()

    const connectionKey = [auth.id, otherId].sort().join('')

    // Create the connection object
    return firebase.child(`connections/${connectionKey}`)
      .set({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
      })
      .then(() => {
        // Set the connection on both user objects
        return P.props({
          setConnectionSelf: firebase.child(`users/${auth.id}/connections/${otherId}`).set(true),
          setConnectionOther: firebase.child(`users/${otherId}/connections/${auth.id}`).set(true),
        })
      })
      .then(() => {
        // Remove the beacon and beaconLocation for both users
        return P.props({
          removeBeaconSelf: firebase.child(`beacons/${auth.id}`).set(null),
          removeBeaconLocationSelf: firebase.child(`beaconLocations/${auth.id}`).set(null),
          removeBeaconOther: firebase.child(`beacons/${otherId}`).set(null),
          removeBeaconLocationOther: firebase.child(`beaconLocations/${otherId}`).set(null),
        })
      })
      .then(() => {
        dispatch({ type: CONNECT_SUCCESS })
      })
  }
}

export function cancelConnecting() {
  return (dispatch) => {
    dispatch({ type: CONNECT_CANCELED })
  }
}
