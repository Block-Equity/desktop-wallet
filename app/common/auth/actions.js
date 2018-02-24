import { verify } from '../../services/authentication/credentials'
import { default as Types } from './types'

const loginRequest = () => {
  return {
    type: 'auth/LOGIN_REQUEST'
  }
}

const loginSuccess = user => {
  return {
    type: 'auth/LOGIN_SUCCESS',
    payload: { user }
  }
}

const loginFailure = error => {
  return {
    type: 'auth/LOGIN_FAILURE',
    payload: error,
    error: true
  }
}

export const login = ({ username, password }) => {
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
