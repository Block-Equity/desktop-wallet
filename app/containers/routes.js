/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './App';
import HomePage from './HomePage';
import CounterPage from './CounterPage';
import MainApp from './MainApp';

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={CounterPage} />
      <Route path="/wallet" component={MainApp} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
