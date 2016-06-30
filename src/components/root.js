import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router'

// Config
import {
  CONNECT_PATH,
  EMAIL_PATH,
  LISTEN_PATH,
  SIGN_IN_PATH,
} from 'src/config'

// Components
import App from './app/app'
import SignIn from './sign-in/sign-in'
import Email from './sign-in/email'
import Connect from './connect/connect'
import Listen from './listen/listen'

export function Root({history, onEnter, store}) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={App} onEnter={onEnter} path="/">
          <Route component={SignIn} path={SIGN_IN_PATH} />
          <Route component={Email} path={EMAIL_PATH} />
          <Route component={Connect} path={CONNECT_PATH} />
          <Route component={Listen} path={LISTEN_PATH} />
        </Route>
      </Router>
    </Provider>
  )
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  onEnter: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired
}
