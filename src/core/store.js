import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducers from './reducers'


export default (initialState = {}) => {
  const logger = createLogger({
    collapsed: true,
  })
  let middleware = applyMiddleware(thunk, logger)

  if (process.env.NODE_ENV !== 'production') {
    // configure redux-devtools-extension
    // @see https://github.com/zalmoxisus/redux-devtools-extension
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      middleware = compose(middleware, devToolsExtension())
    }
  }

  const store = createStore(reducers, initialState, middleware)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default)
    })
  }

  return store
}
