import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

import appReducer from './app'
import authReducer from './auth'
import connectReducer from './connect'
import { firebaseReducer, geofireReducer } from './firebase'
import globeReducer from './globe'
import listenReducer from './listen'
import loadingReducer from './loading'
import locationReducer from './location'
import notificationsReducer from './notifications'
import userReducer from './user'

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  connection: connectReducer,
  firebase: firebaseReducer,
  geofire: geofireReducer,
  globe: globeReducer,
  routing: routerReducer,
  listen: listenReducer,
  location: locationReducer,
  loading: loadingReducer,
  notifications: notificationsReducer,
  user: userReducer,
})
