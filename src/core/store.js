import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { rootReducer } from './root'


export default (initialState = {}) => {
  const logger = createLogger({
    collapsed: true,
  })

  let middleware
  if (process.env.NODE_ENV === 'production') {
    middleware = applyMiddleware(thunk)
  } else {
    middleware = applyMiddleware(thunk, logger)
  }

  if (process.env.NODE_ENV !== 'production') {
    // configure redux-devtools-extension
    // @see https://github.com/zalmoxisus/redux-devtools-extension
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      middleware = compose(middleware, devToolsExtension())
    }
  }

  const store = createStore(rootReducer, initialState, middleware)

  if (module.hot) {
    module.hot.accept('./root', () => {
      store.replaceReducer(rootReducer.default)
    })
  }

  return store
}
