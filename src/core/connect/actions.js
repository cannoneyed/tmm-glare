import P from 'bluebird'
import _ from 'lodash'
import * as util from 'src/util'

import {
  REGISTER_GEOQUERY,
  REMOVE_GEOQUERY,
  CREATE_OWN_BEACON,
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
    const { geofire, connection } = getState()

    // Check to ensure the connection action has not been canceled
    if (!connection.isConnecting) {
      return
    }

    const geoquery = geofire.beaconLocations.query({
      center: [latitude, longitude],
      radius: 300,
    })

    // Store the geoquery object so that we can cancel it on connect success or cancel
    dispatch({ type: REGISTER_GEOQUERY, payload: geoquery })

    // Register event listener for finding a beacon by the geoquery
    geoquery.on('key_entered', (key) => {
      const { auth, firebase, user } = getState()
      const isConnected = _.get(user, ['connections', key])

      // Ignore the user's beacon and any beacons of users the user is already
      // connected to
      if (key === auth.id || isConnected) {
        return
      }

      // Get the user record corresponding to the geokey
      firebase.database().ref().child(`users/${key}`).once('value', snapshot => {
        const otherUser = util.recordFromSnapshot(snapshot)
        const { user, connection } = getState()

        // Ignore found beacons that are already in the list
        const beaconUserIds = connection.beacons.map(user => user.id)
        const existsInBeacons = _.find(beaconUserIds, otherUser.id)
        // Ignore found beacons that the user is already connected to
        const existsInConnections = _.get(user, ['connections', otherUser.id])
        if (existsInBeacons || existsInConnections) {
          return
        }

        // If the current user has access, add this beacon to the list of available
        // users to connect with only if the other user does not
        if (user.hasAccess && !otherUser.hasAccess) {
          return dispatch({ type: FOUND_BEACON, payload: otherUser})
        }

        // Otherwise, only add the beacon to the list if the other user has access
        if (!user.hasAccess && otherUser.hasAccess) {
          return dispatch({ type: FOUND_BEACON, payload: otherUser })
        }
      })
    })

    // Register event listeners for the beacon being removed
    geoquery.on('key_exited', (key) => {
      const { auth } = getState()
      // Ignore the removed beacon if it's the users (this is handled in app)
      if (key === auth.id) {
        return
      }

      // Remove the beacon from the list
      dispatch({ type: REMOVE_BEACON, payload: key })
    })
  }
}

function createOwnBeacon({ coords, timestamp }) {
  const { latitude, longitude } = coords
  return (dispatch, getState) => {
    const { auth, firebase, geofire, connection } = getState()

    // Check to ensure the connection action has not been canceled
    if (!connection.isConnecting) {
      return
    }

    return P.props({
      // Set the beacon location and the corresponding listener for removing on disconnect
      beaconlocation: geofire.beaconLocations.set(auth.id, [latitude, longitude])
        .then(() => firebase.database().ref().child(`beaconLocations/${auth.id}`).onDisconnect().remove()),

      // Set the beacon data and the corresponding listener for removing on disconnect
      beacon: firebase.database().ref().child(`beacons/${auth.id}`)
        .set({ latitude, longitude, timestamp })
        .then(() => firebase.database().ref().child(`beacons/${auth.id}`).onDisconnect().remove())
    })
    .then(() => {
      dispatch({ type: CREATE_OWN_BEACON })
    })
  }
}

export function beginConnecting() {
  return (dispatch, getState) => {
    dispatch({ type: BEGIN_CONNECTING })

    return getGeolocation()
      .catch(err => dispatch(handleGeolocationError(err)))
      .then(location => {
        const { connection } = getState()

        // Check to ensure the connection action has not been canceled
        if (!connection.isConnecting) {
          return
        }

        const { coords } = location
        dispatch({ type: GEOLOCATION_SUCCESS, payload: coords })

        return P.props({
          createOwnBeacon: dispatch(createOwnBeacon(location)),
          findBeacons: dispatch(findBeacons(location)),
        })
      })
  }
}

export function connectWithUser(otherId) {
  return (dispatch, getState) => {
    const { auth, firebase, location } = getState()

    const connectionKey = [auth.id, otherId].sort().join('')

    // Create the connection object
    return firebase.database().ref().child(`connections/${connectionKey}`)
      .set({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
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

export function cancelConnecting() {
  return (dispatch, getState) => {
    dispatch({ type: CONNECT_CANCELED })

    const { firebase, auth, connection } = getState()

    // If a firebase geoquery exists, cancel it
    if (connection.geoquery) {
      connection.geoquery.cancel()
      dispatch({ type: REMOVE_GEOQUERY })
    }


    // Set up a transaction function to ensure that the beacon is erased when connecting is
    // cancelled
    return P.props({
      removeBeacon: firebase.database().ref().child(`beacons/${auth.id}`).transaction(() => null),
      removeBeaconLocation: firebase.database().ref().child(`beaconLocations/${auth.id}`).transaction(() => null)
    })
  }
}
