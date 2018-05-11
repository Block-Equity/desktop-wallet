import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  stellar: undefined
}

export function fetchStellarMarketInfoRequest (state) {
  return {
    ...state
  }
}

export function fetchStellarMarketInfoSuccess (state, payload) {
  const { info } = payload
  return {
    ...state,
    stellar: info
  }
}

export function fetchStellarMarketInfoFailure (state, error) {
  return {
    ...state,
    error: true,
    error
  }
}

const stellarMarketInfoReducers = {
  [Types.MARKET_STELLAR_INFO_REQUEST]: fetchStellarMarketInfoRequest,
  [Types.MARKET_STELLAR_INFO_SUCCESS]: fetchStellarMarketInfoSuccess,
  [Types.MARKET_STELLAR_INFO_FAILURE]: fetchStellarMarketInfoFailure
}

export default createReducer (
  INITIAL_STATE, {
    ...stellarMarketInfoReducers
  }
)