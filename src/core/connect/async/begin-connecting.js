import P from 'bluebird'
import find from 'lodash.find'
import get from 'lodash.get'
import * as util from 'src/util'

import { firebase, geofire } from 'src/firebase'

import {
  registerGeoquery,
  removeBeacon,
  foundBeacon,
  setConnecting,
} from '../index'

import {
  geolocationSuccess,
  geolocationError,
  geolocationDenied,
} from '../../location'

import * as notificationActions from 'src/core/notifications'

// The main exported function for
export default function beginConnectingAsync() {
  return (dispatch, getState) => {

    dispatch(setConnecting(true))

    return getGeolocation()
      .catch(err => dispatch(handleGeolocationErrorAsync(err)))
      .then(location => {
        if (!location) {
          return
        }

        const { connect } = getState()

        // Check to ensure the connect action has not been canceled
        if (!connect.isConnecting) {
          return
        }

        const { coords } = location
        dispatch(geolocationSuccess(coords))

        return P.props({
          createOwnBeacon: dispatch(createOwnBeaconAsync(location)),
          findBeacons: dispatch(findBeaconsAsync(location)),
        })
      })
  }
}

function getGeolocation() {
  if (navigator && navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  } else {
    return Promise.reject()
  }
}

function handleGeolocationErrorAsync(err) {
  return (dispatch) => {
    dispatch(notificationActions.addNotification({
      message: 'You must enable geolocation to use the GLARE app',
      kind: 'danger',
      dismissAfter: 5000,
    }))

    if (err.code === 1 || err.message === 'User denied Geolocation') {
      dispatch(geolocationDenied())
    } else {
      dispatch(geolocationError(err))
    }
  }
}

function createOwnBeaconAsync({ coords, timestamp }) {
  const { latitude, longitude } = coords
  return (dispatch, getState) => {
    const { auth, connect } = getState()

    // Check to ensure the connect action has not been canceled
    if (!connect.isConnecting) {
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
  }
}

function findBeaconsAsync({ coords }) {
  const { latitude, longitude } = coords
  return (dispatch, getState) => {
    const { connect } = getState()

    // Check to ensure the connect action has not been canceled
    if (!connect.isConnecting) {
      return
    }

    const geoquery = geofire.beaconLocations.query({
      center: [latitude, longitude],
      radius: 300,
    })

    // Store the geoquery object so that we can cancel it on connect success or cancel
    dispatch(registerGeoquery(geoquery))

    // Register event listener for finding a beacon by the geoquery
    geoquery.on('key_entered', (key) => {
      const { auth, user } = getState()
      const isConnected = get(user, ['connections', key])

      // Ignore the user's beacon and any beacons of users the user is already
      // connected to
      if (key === auth.id || isConnected) {
        return
      }

      // Get the user record corresponding to the geokey
      firebase.database().ref().child(`users/${key}`).once('value', snapshot => {
        const otherUser = util.recordFromSnapshot(snapshot)
        const { user, connect } = getState()

        // Ignore found beacons that are already in the list
        const beaconUserIds = connect.beacons.map(user => user.id)
        const existsInBeacons = find(beaconUserIds, otherUser.id)
        // Ignore found beacons that the user is already connected to
        const existsInConnections = get(user, ['connections', otherUser.id])
        if (existsInBeacons || existsInConnections) {
          return
        }

        // If the current user has access, add this beacon to the list of available
        // users to connect with only if the other user does not
        if (user.hasAccess && !otherUser.hasAccess) {
          return dispatch(foundBeacon(otherUser))
        }

        // Otherwise, only add the beacon to the list if the other user has access
        if (!user.hasAccess && otherUser.hasAccess) {
          return dispatch(foundBeacon(otherUser))
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
      dispatch(removeBeacon(key))
    })
  }
}
