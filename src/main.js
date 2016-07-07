import './styles/styles.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Firebase from 'firebase'
import GeoFire from 'geofire'
import { createHistory } from 'history'

import { Root } from './components/root'
import { authActions, authRouteResolver } from './core/auth'
import configureStore from './core/store'
import { firebaseConfig } from './config'

const history = useRouterHistory(createHistory)({basename: '/'})

// Initialize firebase and geofire
const firebase = Firebase.initializeApp(firebaseConfig)

const geofire = {
  beaconLocations: new GeoFire(firebase.database().ref().child('beaconLocations')),
  connectionLocations: new GeoFire(firebase.database().ref().child('connectionLocations'))
}

const store = configureStore({ firebase, geofire })

const syncedHistory = syncHistoryWithStore(history, store)

store.dispatch(authActions.initAuth())

ReactDOM.render((
  <Root history={syncedHistory} onEnter={authRouteResolver(store.getState)} store={store} />
), document.querySelector('.app-root'))
