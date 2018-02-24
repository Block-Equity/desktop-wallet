import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import Launch from './core/Launch'
import Main from './core/Main'

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route path='/wallet' component={Main} />
      <Route path='/' component={Launch} />
    </Switch>
  </ConnectedRouter>
)
export default Routes
