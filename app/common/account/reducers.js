import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  isAccountCreated: false,
  isFetching: false,
  error: undefined,
  accounts: undefined,
  currentAccount: undefined
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

function setAccounts (state, payload) {
  const { accounts } = payload
  return {
    ...state,
    accounts
  }
}

function setCurrentAccount (state, payload) {
  const { account } = payload
  return {
    ...state,
    currentAccount: account
  }
}

function accountDetailsRequest (state) {
  return {
    ...state,
    isFetching: true
  }
}

function accountDetailsSuccess (state, payload) {
  const { accounts } = payload
  return {
    ...state,
    isFetching: false,
    accounts
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
  [Types.SET_CURRENT_ACCOUNT]: setCurrentAccount,
  [Types.ACCOUNT_DETAILS_REQUEST]: accountDetailsRequest,
  [Types.ACCOUNT_DETAILS_SUCCESS]: accountDetailsSuccess,
  [Types.ACCOUNT_DETAILS_FAILURE]: accountDetailsFailure
}

export default createReducer(INITIAL_STATE, reducers)
