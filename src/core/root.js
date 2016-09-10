import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

import appReducer from './app'
import authReducer from './auth'
import connectReducer from './connect'
import connectionsReducer from './connections'
import globeReducer from './globe'
import historyReducer from './history'
import journalReducer from './journal'
import listenReducer from './listen'
import loadingReducer from './loading'
import locationReducer from './location'
import messageReducer from './messages'
import notificationsReducer from './notifications'
import userReducer from './user'

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  connect: connectReducer,
  connections: connectionsReducer,
  globe: globeReducer,
  history: historyReducer,
  journal: journalReducer,
  routing: routerReducer,
  listen: listenReducer,
  location: locationReducer,
  loading: loadingReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
  user: userReducer,
})
