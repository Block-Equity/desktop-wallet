import { createReducer } from '../utils'

export const INITIAL_STATE = {
  isAuthenticated: false,
  isFetching: false,
  user: undefined
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
  'auth/LOGIN_REQUEST': loginRequest,
  'auth/LOGIN_SUCCESS': loginSuccess,
  'auth/LOGIN_FAILURE': loginFailure
}

export default createReducer(INITIAL_STATE, reducers)
