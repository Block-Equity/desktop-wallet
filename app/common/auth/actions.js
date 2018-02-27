import * as credentials from '../../services/authentication/credentials'
import * as twoFactor from '../../services/authentication/two-factor'
import * as Types from './types'

import {
  unlock as unlockDb,
  lock as lockDb,
  destroy as destroyDb
} from '../../services/authentication/locking'

export function unlock (password) {
  return async dispatch => {
    dispatch(unlockRequest())

    try {
      await unlockDb({ password })
      // TODO: simply here for dubugging purposes
      if (process.env.NODE_ENV === 'development') {
        global.DATABASE = {
          unlock: unlockDb,
          lock: lockDb,
          destroy: destroyDb
        }
      }
    } catch (e) {
      return dispatch(unlockFailure(e))
    }

    dispatch(unlockSuccess())
  }
}

export function lock (password) {
  return async dispatch => {
    dispatch(lockRequest())

    try {
      await lockDb({ password })
    } catch (e) {
      return dispatch(lockFailure(e))
    }

    dispatch(lockSuccess())
  }
}

export function verifyCredentials ({ username, password }) {
  return async dispatch => {
    dispatch(verifyCredentialsRequest())
    try {
      const token = await credentials.verify(username, password)
      return dispatch(verifyCredentialsSuccess(token))
    } catch (err) {
      return dispatch(verifyCredentialsFailure(err))
    }
  }
}

export function verifiyTwoFa (token) {
  return async dispatch => {
    dispatch(verifyTwoFaRequest())
    try {
      await twoFactor.verify(token)
      return dispatch(verifyTwoFaSuccess())
    } catch (err) {
      return dispatch(verifyTwoFaFailure(err))
    }
  }
}

export function unlockRequest () {
  return {
    type: Types.UNLOCK_REQUEST
  }
}

export function unlockSuccess () {
  return {
    type: Types.UNLOCK_SUCCESS
  }
}

export function unlockFailure (error) {
  return {
    type: Types.UNLOCK_FAILURE,
    payload: error,
    error: true
  }
}

export function lockRequest () {
  return {
    type: Types.LOCK_REQUEST
  }
}

export function lockSuccess (details) {
  return {
    type: Types.LOCK_SUCCESS
  }
}

export function lockFailure (error) {
  return {
    type: Types.LOCK_FAILURE,
    payload: error,
    error: true
  }
}

export function verifyCredentialsRequest () {
  return {
    type: Types.VERIFY_CRENDENTIALS_REQUEST
  }
}

export function verifyCredentialsSuccess (token) {
  return {
    type: Types.VERIFY_CRENDENTIALS_SUCCESS,
    payload: { token }
  }
}

export function verifyCredentialsFailure (error) {
  return {
    type: Types.VERIFY_CRENDENTIALS_FAILURE,
    payload: error,
    error: true
  }
}

export function verifyTwoFaRequest () {
  return {
    type: Types.VERIFY_2FA_REQUEST
  }
}

export function verifyTwoFaSuccess () {
  return {
    type: Types.VERIFY_2FA_SUCCESS
  }
}

export function verifyTwoFaFailure (error) {
  return {
    type: Types.VERIFY_2FA_FAILURE,
    payload: error,
    error: true
  }
}

export function setAuthenticated () {
  return {
    type: Types.SET_AUTHENTICATED
  }
}
