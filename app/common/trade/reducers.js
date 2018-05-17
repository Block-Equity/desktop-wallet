import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  stellar: undefined
}

export function fetchStellarOrderBookRequest (state) {
  return {
    ...state
  }
}

export function fetchStellarOrderBookSuccess (state, payload) {
  const { info } = payload
  return {
    ...state,
    stellar: info
  }
}

export function fetchStellarOrderBookFailure (state, error) {
  return {
    ...state,
    error: true,
    error
  }
}

const stellarOrderBookReducers = {
  [Types.TRADE_STELLAR_ORDER_BOOK_REQUEST]: fetchStellarOrderBookRequest,
  [Types.TRADE_STELLAR_ORDER_BOOK_SUCCESS]: fetchStellarOrderBookSuccess,
  [Types.TRADE_STELLAR_ORDER_BOOK_FAILURE]: fetchStellarOrderBookFailure
}

export default createReducer (
  INITIAL_STATE, {
    ...stellarMarketInfoReducers
  }
)