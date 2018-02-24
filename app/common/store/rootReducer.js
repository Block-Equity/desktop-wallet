
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from '../auth/reducers'
import account from '../account/reducers'
import payment from '../payment/reducers'

export default combineReducers({
  auth,
  account,
  payment,
  router: routerReducer
})
