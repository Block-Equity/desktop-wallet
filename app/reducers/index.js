// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import userState from './userState';

const rootReducer = combineReducers({
  counter,
  userState,
  router,
});

export default rootReducer;
