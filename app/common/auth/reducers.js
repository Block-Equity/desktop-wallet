import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  // TODO: make `isAuthenticated` only true when all the steps are successfull,
  // and not just when the credentials are valid.
  isAuthenticated: false,
  // Log in
  loginFailed: false,
  // Locking
  isUnlocking: false,
  isLocking: false,
  lockingFailed: false,
  unlockingFailed: false,
  isLocked: true,
  // User
  user: undefined
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

function loginRequest (state) {
  return {
    ...state,
    loginFailed: false
  }
}

function loginSuccess (state, payload) {
  return {
    ...state,
    isAuthenticated: true,
    user: payload.user,
    loginFailed: false
  }
}

function loginFailure (state, error) {
  return {
    ...state,
    isAuthenticated: false,
    loginFailed: true,
    error
  }
}

const reducers = {
  [Types.UNLOCK_REQUEST]: unlockRequest,
  [Types.UNLOCK_SUCCESS]: unlockSuccess,
  [Types.UNLOCK_FAILURE]: unlockFailure,
  [Types.LOCK_REQUEST]: lockRequest,
  [Types.LOCK_SUCCESS]: lockSuccess,
  [Types.LOCK_FAILURE]: lockFailure,
  [Types.LOGIN_REQUEST]: loginRequest,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: loginFailure
}

export default createReducer(INITIAL_STATE, reducers)
