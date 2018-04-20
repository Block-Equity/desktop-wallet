import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  isInitializing: false,
  isAccountCreated: false,
  isFetching: false,
  error: undefined,
  accounts: undefined,
  supportedAssets: undefined,
  currentAccount: undefined,
  stellarAssetsDisplay: undefined,
  blockeqTokensDisplay: undefined
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

function accountSupportedAssetsRequest (state) {
  return {
    ...state
  }
}

function accountSupportedAssetsSuccess (state, payload) {
  const { list, response } = payload
  const { supportedAssets } = state
  return {
    ...state,
    supportedAssets: { list, response }
  }
}

function accountSupportedAssetsFailure (state, error) {
  return {
    ...state,
    error
  }
}

function stellarAssetsForDisplaySuccess (state, payload) {
  const { accounts } = payload
  return {
    ...state,
    stellarAssetsDisplay: accounts
  }
}

function stellarAssetsForDisplayFailure (state, payload) {
  return {
    ...state,
    error
  }
}

function blockeqTokensForDisplaySuccess (state, payload) {
  const { accounts } = payload
  return {
    ...state,
    blockeqTokensDisplay: accounts
  }
}

function blockeqTokensForDisplayFailure (state, payload) {
  return {
    ...state,
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
  [Types.ACCOUNT_DETAILS_FAILURE]: accountDetailsFailure,
  [Types.ACCOUNT_SUPPORTED_ASSETS_REQUEST]: accountSupportedAssetsRequest,
  [Types.ACCOUNT_SUPPORTED_ASSETS_SUCCESS]: accountSupportedAssetsSuccess,
  [Types.ACCOUNT_SUPPORTED_ASSETS_FAILURE]: accountSupportedAssetsFailure,
  [Types.STELLAR_ACCOUNTS_DISPLAY_SUCCESS]: stellarAssetsForDisplaySuccess,
  [Types.STELLAR_ACCOUNTS_DISPLAY_FAILURE]: stellarAssetsForDisplayFailure,
  [Types.BLOCKEQ_TOKENS_DISPLAY_SUCCESS]: blockeqTokensForDisplaySuccess,
  [Types.BLOCKEQ_TOKENS_DISPLAY_FAILURE]: blockeqTokensForDisplayFailure
}

export default createReducer(INITIAL_STATE, reducers)
