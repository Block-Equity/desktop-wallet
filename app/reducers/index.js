// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { userState, currentUserWallet } from './userState'

const rootReducer = combineReducers({
  userAccounts: userState,
  currentWallet: currentUserWallet,
  router
})

export default rootReducer
