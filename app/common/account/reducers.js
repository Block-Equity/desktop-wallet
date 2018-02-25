import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  isAccountCreated: false,
  isFetching: false,
  error: undefined,
  accounts: undefined,
  currentAccountId: undefined
}

function accountCreationRequest (state) {
  return {
    ...state,
    isFetching: true
  }
}

function accountCreationSuccess (state) {
  return {
    ...state,
    isAccountCreated: true,
    isFetching: false
  }
}

function accountCreationFailure (state, error) {
  return {
    ...state,
    isAccountCreated: false,
    isFetching: false,
    error
  }
}

function setAccounts (state, accounts) {
  return {
    ...state,
    accounts
  }
}

function setCurrentAccountId (state, accountId) {
  return {
    ...state,
    currentAccountId: accountId
  }
}

function accountDetailsRequest (state) {
  return {
    ...state,
    isFetching: true
  }
}

function accountDetailsSuccess (state) {
  return {
    ...state,
    isFetching: false
  }
}

function accountDetailsFailure (state, error) {
  return {
    ...state,
    isFetching: false,
    error
  }
}
const reducers = {
  [Types.ACCOUNT_CREATION_REQUEST]: accountCreationRequest,
  [Types.ACCOUNT_CREATION_SUCCESS]: accountCreationSuccess,
  [Types.ACCOUNT_CREATION_FAILURE]: accountCreationFailure,
  [Types.SET_ACCOUNTS]: setAccounts,
  [Types.SET_CURRENT_ACCOUNT]: setCurrentAccountId,
  [Types.ACCOUNT_DETAILS_REQUEST]: accountDetailsRequest,
  [Types.ACCOUNT_DETAILS_SUCCESS]: accountDetailsSuccess,
  [Types.ACCOUNT_DETAILS_FAILURE]: accountDetailsFailure
}

export default createReducer(INITIAL_STATE, reducers)
