import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'

const isDev = process.env.NODE_ENV === 'development'

function devTools () {
  if (isDev && window.devToolsExtension) {
    return window.devToolsExtension()
  }
  return f => f
}

export default history => {
  const middleware = [routerMiddleware(history), thunk]
  return createStore(
    rootReducer,
    undefined, // initialState
    compose(
      applyMiddleware(...middleware),
      devTools()
    )
  )
}
