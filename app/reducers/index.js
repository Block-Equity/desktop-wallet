// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import userState from './userState';

const rootReducer = combineReducers({
  userAccounts: userState,
  router,
});

export default rootReducer;
