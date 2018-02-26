import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createHashHistory } from 'history'

// Note: using path aliases here breaks hot reloading
import App from './App'
import createStore from './common/store'
import rootReducer from './common/store/rootReducer'

import './app.global.css'

const history = createHashHistory()
const store = createStore(history)

render(
  <AppContainer>
    <App store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept(rootReducer, () => {
    store.replaceReducer(rootReducer)
  })
  module.hot.accept('./App', () => {
    render(App)
  })
}
