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
    // Register event listener for finding a beacon by the geoquery
    geoQuery.on('key_entered', (key) => {
      const { auth, firebase, user, connection } = getState()
      const isConnected = _.get(user, ['connections', key])

      // Ignore the user's beacon and any beacons of users the user is already
      // connected to
      if (key === auth.id || isConnected) {
        return
      }

      // Get the user record corresponding to the geokey
      firebase.child(`users/${key}`).once('value', snapshot => {
        const otherUser = util.recordFromSnapshot(snapshot)
        const { user } = getState()

        // Ignore found beacons that are already in the list
        const beaconUserIds = connection.beacons.map(user => user.id)
        const existsInBeacons = _.find(beaconUserIds, otherUser.id)
        // Ignore found beacons that the user is already connected to
        const existsInConnections = _.get(user, ['connections', otherUser.id])
        if (existsInBeacons || existsInConnections) {
          return
        }

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
      const { auth, firebase, user } = getState()
      // Ignore the removed beacon if it's the users (this is handled in app)
      if (key === auth.id) {
        return
      }

      // If the key being removed is on the user object, meaning a connection has occurred,
      // dispatch a succesful connection
      if (user.connections[key]) {
        dispatch({ type: CONNECT_SUCCESS, payload: key })
      }

      // Otherwise, get the user record corresponding to the removed beacon to remove
      // from the beacons list
      firebase.child(`users/${key}`).once('value', snapshot => {
        const toRemove = util.recordFromSnapshot(snapshot)
        dispatch({ type: REMOVE_BEACON, payload: toRemove.id })
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
        // Set the connection and set hasAccess true on both user objects
        const selfToUpdate = {
          [`connections/${otherId}`]: true,
          hasAccess: true,
        }

        const otherToUpdate = {
          [`connections/${auth.id}`]: true,
          hasAccess: true,
        }

        return P.props({
          setConnectionSelf: firebase.child(`users/${auth.id}`).update(selfToUpdate),
          setConnectionOther: firebase.child(`users/${otherId}`).update(otherToUpdate),
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
        dispatch({ type: CONNECT_SUCCESS, payload: otherId })
      })
  }
}

export function cancelConnecting() {
  return (dispatch, getState) => {
    dispatch({ type: CONNECT_CANCELED })

    const { firebase, auth } = getState()

    // Set up a transaction function to ensure that the beacon is erased when connecting is
    // cancelled
    return P.props({
      removeBeacon: firebase.child(`beacons/${auth.id}`).transaction(() => null),
      removeBeaconLocation: firebase.child(`beaconLocations/${auth.id}`).transaction(() => null)
    })
  }
}
