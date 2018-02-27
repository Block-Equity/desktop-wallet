import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  // Log in
  isVerifyingCredentials: false,
  areCredentialsVerified: false,
  credentialsFailed: false,
  token: undefined, // <-- needed to unlock the DB
  // 2-FA
  isVerifyingTwoFa: false,
  isTwoFaVerified: false,
  twoFaVerificationFailed: false,
  // Locking
  isUnlocking: false,
  isLocking: false,
  lockingFailed: false,
  unlockingFailed: false,
  isLocked: true,
  // Auth values
  error: undefined,
  // When Credentials and 2-FA succeed, the user is fully
  // authenticated (and thus actually logged in)
  isAuthenticated: false
}

function unlockRequest (state) {
  return {
    ...state,
    isUnlocking: true
  }
}

function unlockSuccess (state) {
  return {
    ...state,
    isUnlocking: false,
    isLocked: false
  }
}

function unlockFailure (state, error) {
  return {
    ...state,
    isUnlocking: false,
    isLocked: true,
    unlockingFailed: true,
    error
  }
}

function lockRequest (state) {
  return {
    ...state,
    isLocking: true
  }
}

function lockSuccess (state) {
  return {
    ...state,
    isLocking: false,
    isLocked: false
  }
}

function lockFailure (state, error) {
  return {
    ...state,
    isLocking: false,
    lockingFailed: true,
    error
  }
}

function verifyCredentialsRequest (state) {
  return {
    ...state,
    isVerifyingCredentials: true
  }
}

function verifyCredentialsSuccess (state, payload) {
  const { token } = payload
  return {
    ...state,
    token,
    areCredentialsVerified: true,
    isVerifyingCredentials: false
  }
}

function verifyCredentialsFailure (state, error) {
  return {
    ...state,
    isVerifyingCredentials: false,
    credentialsFailed: true,
    error
  }
}

function verifyTwoFaRequest (state) {
  return {
    ...state,
    isVerifying: true
  }
}

function verifyTwoFaSuccess (state) {
  return {
    ...state,
    isTwoFaVerified: true,
    isVerifyingTwoFa: false
  }
}

function verifyTwoFaFailure (state, error) {
  return {
    ...state,
    isTwoFaVerified: false,
    isVerifyingTwoFa: false,
    twoFaVerificationFailed: true,
    error
  }
}

function setAuthenticated (state) {
  return {
    ...state,
    isAuthenticated: true
  }
}

const reducers = {
  [Types.UNLOCK_REQUEST]: unlockRequest,
  [Types.UNLOCK_SUCCESS]: unlockSuccess,
  [Types.UNLOCK_FAILURE]: unlockFailure,
  [Types.LOCK_REQUEST]: lockRequest,
  [Types.LOCK_SUCCESS]: lockSuccess,
  [Types.LOCK_FAILURE]: lockFailure,
  [Types.VERIFY_CRENDENTIALS_REQUEST]: verifyCredentialsRequest,
  [Types.VERIFY_CRENDENTIALS_SUCCESS]: verifyCredentialsSuccess,
  [Types.VERIFY_CRENDENTIALS_FAILURE]: verifyCredentialsFailure,
  [Types.VERIFY_2FA_REQUEST]: verifyTwoFaRequest,
  [Types.VERIFY_2FA_SUCCESS]: verifyTwoFaSuccess,
  [Types.VERIFY_2FA_FAILURE]: verifyTwoFaFailure,
  [Types.SET_AUTHENTICATED]: setAuthenticated
}

export default createReducer(INITIAL_STATE, reducers)
