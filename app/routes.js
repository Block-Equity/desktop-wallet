import React from 'react'
import { Switch } from 'react-router-dom'
import Route from './common/auth/route'
import Launch from './core/Launch'
import Wallet from './core/Wallet'
import AppView from './core/AppView'
import Creation from './core/Creation'
import Restore from './core/Restore'

const Routes = ({ history }) => (
  <Switch>
    <Route path='/restore' component={Restore} />
    <Route path='/create' component={Creation} />
    <Route path='/wallet' component={AppView} />
    <Route path='/' component={Launch} />
  </Switch>
)

export default Routes
