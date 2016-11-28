import './styles/styles.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import Raven from 'raven-js'
import config from './config'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { createHistory } from 'history'

import { Root } from './components/root'
import { initAuthAsync } from './core/auth'
import authRouteResolver from './core/auth/route-resolver'
import configureStore from './core/store'

import { fixScrollOn } from './page/fix-scroll'
import { checkIncognito } from './page/check-incognito'

import * as appActions from 'src/core/app'

Raven.config(config.sentryUrl, {
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
}).install()

const history = useRouterHistory(createHistory)({basename: '/'})

const store = configureStore()
const syncedHistory = syncHistoryWithStore(history, store)

// Initial auth loading action
store.dispatch(initAuthAsync())

ReactDOM.render((
  <Root history={syncedHistory} onEnter={authRouteResolver(store.getState)} store={store} />
), document.querySelector('.app-root'))

// Fix the scroll issues by default
fixScrollOn()

const isIncognito = checkIncognito()
if (isIncognito) {
  store.dispatch(appActions.isIncognito())
}
