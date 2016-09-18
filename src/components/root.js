import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router'

// Components
import About from './about/about'
import App from './app/app'
import Connect from './connect/connect'
import Connections from './connections/connections'
import Intro from './about/intro'
import Journal from './journal/journal'
import Listen from './listen/listen'
import SignIn from './sign-in/sign-in'
import Tracks from './tracks/tracks'
import Help from './help/help'

export function Root({history, onEnter, store}) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={App} onEnter={onEnter} path="/">
          <Route component={SignIn} onEnter={onEnter} path={'/sign-in'} />
          <Route component={Connect} onEnter={onEnter} path={'/connect'} />
          <Route component={Connections} onEnter={onEnter} path={'/connections'} />
          <Route component={Listen} onEnter={onEnter} path={'/listen'} />
          <Route component={Intro} onEnter={onEnter} path={'/intro'} />
          <Route component={Journal} onEnter={onEnter} path={'/journal'} />
          <Route component={About} path={'/about'} />
          <Route component={Help} path={'/help'} />
          <Route path="/tracks" onEnter={onEnter} component={Tracks}>
            <Route path="/tracks/:trackId" component={Tracks} />
          </Route>
          <Route path="*" component={Connect} />
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
