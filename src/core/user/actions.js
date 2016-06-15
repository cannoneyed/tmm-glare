import _ from 'lodash'
import P from 'bluebird'
import * as util from 'src/util'

import {
  LOAD_USER,
  UPDATE_ACCESS,
  ADD_CONNECTION,
} from './action-types'

import {
  CONNECT_SUCCESS,
} from '../connect/action-types'

import { notificationActions } from 'src/core/notifications'

export function loadOrCreateUser(authUser) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    // Lookup existing user object
    return firebase.database().ref().child(`users/${authUser.uid}`).once('value', snapshot => {
      const user = util.recordFromSnapshot(snapshot)

      // If the user exists, no need to create a new user record
      if (user) {
        return user
      }

      // Otherwise, create a new user record
      const facebook = authUser.providerData[0]
      return firebase.database().ref().child(`users/${authUser.uid}`).set({
        connections: {},
        id: facebook.uid,
        hasAccess: false,
        displayName: facebook.displayName,
        profileImageURL: facebook.photoURL,
        email: facebook.email,
      })
    })
  }
}

export function getUserData(userId) {
  return (dispatch) => {
    return P.resolve()
    .then(() => {
      return dispatch(loadUser(userId))
    })
    .then(() => {
      return dispatch(registerUserListeners(userId))
    })
  }
}

export function loadUser(userId) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child(`users/${userId}`).once('value', snapshot => {
      const user = util.recordFromSnapshot(snapshot)

      dispatch({ type: LOAD_USER, payload: user })
    })
  }
}

export function registerUserListeners(userId) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    // Register the user access listener
    firebase.database().ref().child(`users/${userId}/hasAccess`).on('value', snapshot => {
      const { user } = getState()
      const access = util.recordFromSnapshot(snapshot)

      // If the access hasn't changed, don't dispatch the action
      if (user.hasAccess === access) {
        return
      }

      dispatch({
        type: UPDATE_ACCESS,
        payload: access,
      })
    })

    // Register the user connection listener
    firebase.database().ref().child(`users/${userId}/connections`).on('child_added', snapshot => {
      const { user } = getState()
      const id = util.recordFromSnapshot(snapshot)

      // If the connection is already present on the user, don't dispatch the action
      const isConnected = _.get(user, ['connections', id])
      if (isConnected) {
        return
      }

      dispatch({ type: ADD_CONNECTION, payload: id })
      dispatch({ type: CONNECT_SUCCESS })
      dispatch(displayConnectionNotification(id))
    })
  }
}

function displayConnectionNotification(id) {
  return (dispatch, getState) => {
    const { firebase } = getState()

    firebase.database().ref().child(`users/${id}`).once('value', snapshot => {
      const connectedUser = util.recordFromSnapshot(snapshot)

      const didShare = Object.keys(connectedUser.connections).length <= 1
      const message = didShare ? 'Shared' : 'Connected'

      dispatch(notificationActions.addNotification({
        message: `${message} with ${connectedUser.displayName}`,
        kind: 'info',
        dismissAfter: 5000,
      }))
    })
  }
}
