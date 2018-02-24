import { createReducer } from '../utils'

export const INITIAL_STATE = {
  isAccountCreated: false,
  isFetching: false,
  error: undefined,
  accounts: undefined,
  currentAccountId: undefined,
  currentAccountDetails: undefined
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
  'account/ACCOUNT_CREATION_REQUEST': accountCreationRequest,
  'account/ACCOUNT_CREATION_SUCCESS': accountCreationSuccess,
  'account/ACCOUNT_CREATION_FAILURE': accountCreationFailure,
  'account/ACCOUNTS': setAccounts,
  'account/CURRENT_ACCOUNT': setCurrentAccountId,
  'account/ACCOUNT_DETAILS_REQUEST': accountDetailsRequest,
  'account/ACCOUNT_DETAILS_SUCCESS': accountDetailsSuccess,
  'account/CURRENT_ACACCOUNT_DETAILS_FAILURECOUNT': accountDetailsFailure
}

export default createReducer(INITIAL_STATE, reducers)
