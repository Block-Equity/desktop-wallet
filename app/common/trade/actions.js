import * as Types from './types'
import { getOrderBook } from '../../services/networking/horizon'
import { getCurrentAccount } from '../account/selectors'
import { getUserPIN } from '../../db'
import * as encryption from '../../services/security/encryption'

export function fetchStellarOrderBook(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer) {
  return async dispatch => {
    dispatch(fetchStellarOrderBookRequest())
    try {
      const { payload, error, errorMessage } = await getOrderBook(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer)
      if (error) {
        return dispatch(fetchStellarOrderBookFailure(errorMessage))
      }
      return dispatch(fetchStellarOrderBookSuccess(payload))
    } catch (e) {
      return dispatch(fetchStellarOrderBookFailure(e))
    }
  }
}

export function fetchStellarOrderBookRequest () {
  return {
    type: Types.TRADE_STELLAR_ORDER_BOOK_REQUEST
  }
}

export function fetchStellarOrderBookSuccess (orderbook) {
  return {
    type: Types.TRADE_STELLAR_ORDER_BOOK_SUCCESS,
    payload: { orderbook }
  }
}

export function fetchStellarOrderBookFailure (error) {
  return {
    type: Types.TRADE_STELLAR_ORDER_BOOK_FAILURE,
    payload: error,
    error: true
  }
}