import * as credentials from '../../services/authentication/credentials'
import * as twoFactor from '../../services/authentication/two-factor'
import { getAuthToken } from './selectors'
import * as Types from './types'
import * as locking from '../../services/authentication/locking'

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

export function unlock () {
  return async (dispatch, getState) => {
    dispatch(unlockRequest())

    try {
      // Pull the auth token from the state, and use it to unlock the DB
      const token = getAuthToken(getState())

      await locking.unlock({ password: token })
      // TODO: simply here for dubugging purposes
      if (process.env.NODE_ENV === 'development') {
        global.DATABASE = { ...locking }
      }
    } catch (e) {
      return dispatch(unlockFailure(e))
    }

    return dispatch(unlockSuccess())
  }
}

export function lock () {
  return async (dispatch, getState) => {
    dispatch(unlockRequest())

    try {
      // Pull the auth token from the state, and use it to lock the DB
      const token = getAuthToken(getState())

      await locking.lock({ password: token })
    } catch (e) {
      return dispatch(lockFailure(e))
    }

    return dispatch(lockSuccess())
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
