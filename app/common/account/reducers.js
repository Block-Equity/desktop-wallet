import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  isInitializing: false,
  isAccountCreated: false,
  isFetching: false,
  error: undefined,
  accounts: undefined,
  currentAccount: undefined
}

export function accountInitializationRequest (state) {
  return {
    ...state,
    isInitializing: true
  }
}

export function accountInitializationSuccess (state, payload) {
  const { accounts } = payload
  return {
    ...state,
    isInitializing: true,
    accounts
  }
}

export function accountInitializationFailure (state) {
  return {
    ...state,
    isInitializing: false,
    error: true
  }
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

function accountDetailsSuccess (state) {
  return {
    ...state,
    isFetching: false,
    fetchingFailed: false
  }
}

function accountDetailsFailure (state, error) {
  return {
    ...state,
    isFetching: false,
    fetchingFailed: true,
    error
  }
}
const reducers = {
  [Types.ACCOUNT_INITIALIZATION_REQUEST]: accountInitializationRequest,
  [Types.ACCOUNT_INITIALIZATION_SUCCESS]: accountInitializationSuccess,
  [Types.ACCOUNT_INITIALIZATION_FAILURE]: accountInitializationFailure,
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
