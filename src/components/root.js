import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router'

// Components
import About from './about/about'
import App from './app/app'
import Connect from './connect/connect'
import Graph from './graph/graph'
import Intro from './about/intro'
import Leaderboard from './leaderboard/leaderboard'
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
          <Route component={Graph} onEnter={onEnter} path={'/graph'} />
          <Route component={Listen} onEnter={onEnter} path={'/listen'} />
          <Route component={Intro} onEnter={onEnter} path={'/intro'} />
          <Route component={Leaderboard} onEnter={onEnter} path={'/Leaderboard'} />
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
