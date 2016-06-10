import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import { authReducer } from './auth'
import { firebaseReducer, geofireReducer } from './firebase'
import { connectReducer } from './connect'
import { userReducer } from './user'
import { locationReducer } from './location'
import { listenReducer } from './listen'
import { loadingReducer } from './loading'
import { notificationsReducer } from './notifications'

export default combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  geofire: geofireReducer,
  routing: routerReducer,
  connection: connectReducer,
  user: userReducer,
  location: locationReducer,
  listen: listenReducer,
  loading: loadingReducer,
  notifications: notificationsReducer,
})
