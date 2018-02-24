import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Launch from './core/Launch'
import Main from './core/Main'

const Routes = ({ history }) => (
  <Switch>
    <Route path='/wallet' component={Main} />
    <Route path='/' component={Launch} />
  </Switch>
)

export default Routes
