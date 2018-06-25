import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  exchanges: undefined,
  error: undefined
}

export function exchangeListRequest(state) {
  return {
    ...state
  }
}

export function exchangeListSuccess(state, payload) {
  const { response } = payload
  return {
    ...state,
    exchanges: response
  }
}

export function exchangeListFailure(state, payload) {
  return {
    ...state,
    error: true,
    errorMessage: payload
  }
}

const exchangeListReducers = {
  [Types.EXCHANGE_DIRECTORY_REQUEST]: exchangeListRequest,
  [Types.EXCHANGE_DIRECTORY_SUCCESS]: exchangeListSuccess,
  [Types.EXCHANGE_DIRECTORY_FAILURE]: exchangeListFailure
}

export default createReducer (
  INITIAL_STATE, {
    ...exchangeListReducers
  }
)
