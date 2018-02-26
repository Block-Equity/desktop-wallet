import { verify } from '../../services/authentication/credentials'
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

export function login ({ username, password }) {
  return async dispatch => {
    dispatch(loginRequest())
    try {
      const token = await verify(username, password)
      return dispatch(loginSuccess(token))
    } catch (err) {
      return dispatch(loginFailure(err))
    }
  }
}

export function unlockRequest () {
  return {
    type: Types.UNLOCK_REQUEST
  }
}

export function unlockSuccess (details) {
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

export function loginRequest () {
  return {
    type: Types.LOGIN_REQUEST
  }
}

export function loginSuccess (user) {
  return {
    type: Types.LOGIN_SUCCESS,
    payload: { user }
  }
}

export function loginFailure (error) {
  return {
    type: Types.LOGIN_FAILURE,
    payload: error,
    error: true
  }
}
