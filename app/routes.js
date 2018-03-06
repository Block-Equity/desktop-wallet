import React from 'react'
import { Switch } from 'react-router-dom'
import Route from './common/auth/route'
import Launch from './core/Launch'
import Main from './core/Main'
import Creation from './core/Creation'

const Routes = ({ history }) => (
  <Switch>
    <Route path='/wallet' component={Main} />
    <Route path='/creation' component={Creation} />
    <Route path='/' component={Launch} />
  </Switch>
)

export default Routes
